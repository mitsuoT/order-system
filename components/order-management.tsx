"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/components/language-provider"
import { Download, FileText } from "lucide-react"

interface Order {
  id: string
  orderDate: string
  customerCode: string
  customerName: string
  items: OrderItem[]
  status: "pending" | "confirmed" | "shipped" | "delivered"
  totalAmount: number
}

interface OrderItem {
  productCode: string
  productName: string
  quantity: number
  unitPrice: number
  amount: number
}

export function OrderManagement() {
  const { t } = useLanguage()
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD001",
      orderDate: "2024-01-15",
      customerCode: "REST001",
      customerName: "レストラン田中 / 다나카 레스토랑",
      status: "pending",
      totalAmount: 4500,
      items: [
        {
          productCode: "V001",
          productName: "キャベツ / 양배추",
          quantity: 10,
          unitPrice: 150,
          amount: 1500,
        },
        {
          productCode: "M001",
          productName: "牛肉 / 소고기",
          quantity: 1,
          unitPrice: 2800,
          amount: 2800,
        },
      ],
    },
    {
      id: "ORD002",
      orderDate: "2024-01-14",
      customerCode: "REST002",
      customerName: "カフェ山田 / 야마다 카페",
      status: "confirmed",
      totalAmount: 1800,
      items: [
        {
          productCode: "S001",
          productName: "サーモン / 연어",
          quantity: 1.5,
          unitPrice: 1200,
          amount: 1800,
        },
      ],
    },
  ])

  const statusOptions = [
    { value: "pending", label: t.pending, color: "bg-yellow-100 text-yellow-800" },
    { value: "confirmed", label: t.confirmed, color: "bg-blue-100 text-blue-800" },
    { value: "shipped", label: t.shipped, color: "bg-purple-100 text-purple-800" },
    { value: "delivered", label: t.delivered, color: "bg-green-100 text-green-800" },
  ]

  const updateOrderStatus = (orderId: string, status: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: status as Order["status"] } : order)))
  }

  const exportToPCACSV = (order: Order) => {
    // PCA商魂用CSVデータの生成
    const csvData = order.items.map((item) => ({
      売上日付: order.orderDate,
      得意先コード: order.customerCode,
      得意先名: order.customerName,
      商品コード: item.productCode,
      商品名: item.productName,
      数量: item.quantity,
      単価: item.unitPrice,
      金額: item.amount,
      税区分: "1", // 課税
      備考: `注文番号: ${order.id}`,
    }))

    // CSVファイルの生成とダウンロード
    const headers = Object.keys(csvData[0])
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => headers.map((header) => `"${row[header as keyof typeof row]}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `PCA_${order.id}_${order.orderDate}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportAllOrdersCSV = () => {
    const allItems = orders.flatMap((order) =>
      order.items.map((item) => ({
        注文番号: order.id,
        売上日付: order.orderDate,
        得意先コード: order.customerCode,
        得意先名: order.customerName,
        商品コード: item.productCode,
        商品名: item.productName,
        数量: item.quantity,
        単価: item.unitPrice,
        金額: item.amount,
        税区分: "1",
        備考: `ステータス: ${statusOptions.find((s) => s.value === order.status)?.label}`,
      })),
    )

    const headers = Object.keys(allItems[0])
    const csvContent = [
      headers.join(","),
      ...allItems.map((row) => headers.map((header) => `"${row[header as keyof typeof row]}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `PCA_ALL_ORDERS_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t.orderManagement}</h2>
        <div className="flex space-x-2">
          <Button onClick={exportAllOrdersCSV} variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>{t.pcaExport}</span>
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center space-x-3">
                    <span>{order.id}</span>
                    <Badge className={statusOptions.find((s) => s.value === order.status)?.color}>
                      {statusOptions.find((s) => s.value === order.status)?.label}
                    </Badge>
                  </CardTitle>
                  <div className="text-sm text-gray-600 mt-2">
                    <p>
                      {t.orderDate}: {order.orderDate}
                    </p>
                    <p>
                      {t.customerCode}: {order.customerCode}
                    </p>
                    <p>
                      {t.customerName}: {order.customerName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => exportToPCACSV(order)}
                    className="flex items-center space-x-1"
                  >
                    <FileText className="h-4 w-4" />
                    <span>CSV</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.productCode}</TableHead>
                    <TableHead>{t.productName}</TableHead>
                    <TableHead>{t.quantity}</TableHead>
                    <TableHead>{t.unitPrice}</TableHead>
                    <TableHead>{t.amount}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.productCode}</TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>¥{item.unitPrice.toLocaleString()}</TableCell>
                      <TableCell>¥{item.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-50">
                    <TableCell colSpan={4} className="font-bold text-right">
                      {t.total}:
                    </TableCell>
                    <TableCell className="font-bold">¥{order.totalAmount.toLocaleString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
