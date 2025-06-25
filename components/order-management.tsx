"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Download, FileText, Trash2, AlertCircle } from "lucide-react"
import { supabase, isDemo, type Order, type OrderDetail, type Product } from "@/lib/database"
import { generateOrderNumber } from "@/lib/order-number"
import { convertOrderToPCAFormat, generatePCACSV } from "@/lib/csv-export"
import { ProductSearch } from "./product-search"

interface OrderManagementProps {
  language: "ja" | "ko" | "en"
}

export function OrderManagement({ language }: OrderManagementProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [newOrder, setNewOrder] = useState<Partial<Order>>({})
  const [orderDetails, setOrderDetails] = useState<Partial<OrderDetail>[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  const texts = {
    ja: {
      title: "受注管理",
      addNew: "新規受注",
      orderNo: "受注番号",
      orderDate: "受注日",
      deliveryDate: "納期",
      customerCode: "得意先コード",
      customerName: "得意先名",
      totalAmount: "合計金額",
      status: "ステータス",
      save: "保存",
      cancel: "キャンセル",
      addProduct: "商品追加",
      exportCSV: "CSV出力",
      delete: "削除",
      pending: "受注中",
      completed: "完了",
      cancelled: "キャンセル",
      demoMode: "デモモード",
      demoWarning: "デモモードでは変更は保存されません",
    },
    ko: {
      title: "수주 관리",
      addNew: "신규 수주",
      orderNo: "수주번호",
      orderDate: "수주일",
      deliveryDate: "납기",
      customerCode: "거래처 코드",
      customerName: "거래처명",
      totalAmount: "합계 금액",
      status: "상태",
      save: "저장",
      cancel: "취소",
      addProduct: "상품 추가",
      exportCSV: "CSV 출력",
      delete: "삭제",
      pending: "수주중",
      completed: "완료",
      cancelled: "취소",
      demoMode: "데모 모드",
      demoWarning: "데모 모드에서는 변경사항이 저장되지 않습니다",
    },
    en: {
      title: "Order Management",
      addNew: "New Order",
      orderNo: "Order No",
      orderDate: "Order Date",
      deliveryDate: "Delivery Date",
      customerCode: "Customer Code",
      customerName: "Customer Name",
      totalAmount: "Total Amount",
      status: "Status",
      save: "Save",
      cancel: "Cancel",
      addProduct: "Add Product",
      exportCSV: "Export CSV",
      delete: "Delete",
      pending: "Pending",
      completed: "Completed",
      cancelled: "Cancelled",
      demoMode: "Demo Mode",
      demoWarning: "Changes are not saved in demo mode",
    },
  }

  const t = texts[language]

  useEffect(() => {
    fetchOrders()
    fetchProducts()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      if (isDemo) {
        // Use empty array for demo mode
        setOrders([])
      } else {
        const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

        if (error) throw error
        setOrders(data || [])
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      if (isDemo) {
        // Products will be fetched by ProductSearch component
        setProducts([])
      } else {
        const { data, error } = await supabase.from("products").select("*").eq("is_active", true)

        if (error) throw error
        setProducts(data || [])
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
    }
  }

  const startCreating = async () => {
    try {
      const orderNo = await generateOrderNumber()
      setNewOrder({
        order_no: orderNo,
        order_date: new Date().toISOString().split("T")[0],
        customer_code: "",
        customer_name: "",
        department_code: "000000",
        staff_code: "0000000000000",
        total_amount: 0,
        tax_amount: 0,
        status: "pending",
      })
      setOrderDetails([])
      setIsCreating(true)
    } catch (error) {
      console.error("Error generating order number:", error)
    }
  }

  const addProductToOrder = (product: Product) => {
    const newDetail: Partial<OrderDetail> = {
      product_code: product.code,
      product_name: product.name,
      quantity: 1,
      unit_price: product.price,
      amount: product.price,
      tax_rate: 10.0,
    }
    setOrderDetails([...orderDetails, newDetail])
    updateOrderTotal([...orderDetails, newDetail])
  }

  const updateOrderDetail = (index: number, field: keyof OrderDetail, value: any) => {
    const updated = [...orderDetails]
    updated[index] = { ...updated[index], [field]: value }

    if (field === "quantity" || field === "unit_price") {
      const quantity = field === "quantity" ? value : updated[index].quantity || 0
      const unitPrice = field === "unit_price" ? value : updated[index].unit_price || 0
      updated[index].amount = quantity * unitPrice
    }

    setOrderDetails(updated)
    updateOrderTotal(updated)
  }

  const updateOrderTotal = (details: Partial<OrderDetail>[]) => {
    const totalAmount = details.reduce((sum, detail) => sum + (detail.amount || 0), 0)
    const taxAmount = Math.floor(totalAmount * 0.1)
    setNewOrder({
      ...newOrder,
      total_amount: totalAmount,
      tax_amount: taxAmount,
    })
  }

  const removeOrderDetail = (index: number) => {
    const updated = orderDetails.filter((_, i) => i !== index)
    setOrderDetails(updated)
    updateOrderTotal(updated)
  }

  const saveOrder = async () => {
    if (!newOrder.customer_code || orderDetails.length === 0) return

    if (isDemo) {
      alert(t.demoWarning)
      setIsCreating(false)
      setNewOrder({})
      setOrderDetails([])
      return
    }

    setLoading(true)
    try {
      // 受注保存
      const { data: orderData, error: orderError } = await supabase.from("orders").insert([newOrder]).select().single()

      if (orderError) throw orderError

      // 受注明細保存
      const detailsToInsert = orderDetails.map((detail) => ({
        ...detail,
        order_id: orderData.id,
      }))

      const { error: detailsError } = await supabase.from("order_details").insert(detailsToInsert)

      if (detailsError) throw detailsError

      await fetchOrders()
      setIsCreating(false)
      setNewOrder({})
      setOrderDetails([])
    } catch (error) {
      console.error("Error saving order:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportOrderToCSV = async (order: Order) => {
    if (isDemo) {
      // Generate demo CSV
      const demoOrderDetails: OrderDetail[] = [
        {
          id: "1",
          order_id: order.id,
          product_code: "PROD001",
          product_name: "Premium Rice",
          quantity: 2,
          unit_price: 2500,
          amount: 5000,
          tax_rate: 10,
          created_at: new Date().toISOString(),
        },
      ]

      const pcaData = convertOrderToPCAFormat(order, demoOrderDetails, [])
      const csvContent = generatePCACSV(pcaData)

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `demo_order_${order.order_no}.csv`
      link.click()
      return
    }

    try {
      // 受注明細取得
      const { data: details, error } = await supabase.from("order_details").select("*").eq("order_id", order.id)

      if (error) throw error

      // PCAフォーマットに変換
      const pcaData = convertOrderToPCAFormat(order, details || [], products)
      const csvContent = generatePCACSV(pcaData)

      // CSVダウンロード
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `order_${order.order_no}.csv`
      link.click()
    } catch (error) {
      console.error("Error exporting CSV:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">{t.title}</h2>
          {isDemo && <Badge variant="outline">{t.demoMode}</Badge>}
        </div>
        <Button onClick={startCreating}>
          <Plus className="h-4 w-4 mr-2" />
          {t.addNew}
        </Button>
      </div>

      {isDemo && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{t.demoWarning}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{t.addNew}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label>{t.orderNo}</Label>
                <Input value={newOrder.order_no || ""} disabled />
              </div>
              <div>
                <Label>{t.orderDate}</Label>
                <Input
                  type="date"
                  value={newOrder.order_date || ""}
                  onChange={(e) => setNewOrder({ ...newOrder, order_date: e.target.value })}
                />
              </div>
              <div>
                <Label>{t.deliveryDate}</Label>
                <Input
                  type="date"
                  value={newOrder.delivery_date || ""}
                  onChange={(e) => setNewOrder({ ...newOrder, delivery_date: e.target.value })}
                />
              </div>
              <div>
                <Label>{t.status}</Label>
                <Select
                  value={newOrder.status || "pending"}
                  onValueChange={(value) => setNewOrder({ ...newOrder, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">{t.pending}</SelectItem>
                    <SelectItem value="completed">{t.completed}</SelectItem>
                    <SelectItem value="cancelled">{t.cancelled}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{t.customerCode}</Label>
                <Input
                  value={newOrder.customer_code || ""}
                  onChange={(e) => setNewOrder({ ...newOrder, customer_code: e.target.value })}
                />
              </div>
              <div>
                <Label>{t.customerName}</Label>
                <Input
                  value={newOrder.customer_name || ""}
                  onChange={(e) => setNewOrder({ ...newOrder, customer_name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <ProductSearch language={language} onProductSelect={addProductToOrder} />
            </div>

            {orderDetails.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">受注明細</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>商品コード</TableHead>
                      <TableHead>商品名</TableHead>
                      <TableHead>数量</TableHead>
                      <TableHead>単価</TableHead>
                      <TableHead>金額</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderDetails.map((detail, index) => (
                      <TableRow key={index}>
                        <TableCell>{detail.product_code}</TableCell>
                        <TableCell>{detail.product_name}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={detail.quantity || 0}
                            onChange={(e) =>
                              updateOrderDetail(index, "quantity", Number.parseFloat(e.target.value) || 0)
                            }
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={detail.unit_price || 0}
                            onChange={(e) =>
                              updateOrderDetail(index, "unit_price", Number.parseFloat(e.target.value) || 0)
                            }
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>¥{(detail.amount || 0).toLocaleString()}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => removeOrderDetail(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4 text-right">
                  <div className="text-lg font-semibold">
                    {t.totalAmount}: ¥{(newOrder.total_amount || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    税額: ¥{(newOrder.tax_amount || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={saveOrder} disabled={loading || !newOrder.customer_code || orderDetails.length === 0}>
                <FileText className="h-4 w-4 mr-2" />
                {t.save}
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                {t.cancel}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{order.order_no}</h3>
                    <Badge
                      variant={
                        order.status === "completed"
                          ? "default"
                          : order.status === "cancelled"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {order.status === "pending"
                        ? t.pending
                        : order.status === "completed"
                          ? t.completed
                          : t.cancelled}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">{t.orderDate}:</span>
                      <div>{new Date(order.order_date).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t.customerName}:</span>
                      <div>{order.customer_name || order.customer_code}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t.totalAmount}:</span>
                      <div>¥{order.total_amount.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">作成日:</span>
                      <div>{new Date(order.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => exportOrderToCSV(order)}>
                    <Download className="h-4 w-4 mr-1" />
                    {t.exportCSV}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {orders.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            {isDemo ? "デモモードでは管理機能は制限されています" : "受注がありません"}
          </div>
        )}
      </div>
    </div>
  )
}
