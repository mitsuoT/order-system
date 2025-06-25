"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { Search, Eye, RotateCcw } from "lucide-react"

interface OrderHistoryItem {
  id: string
  orderNumber: string
  orderDate: string
  status: "pending" | "confirmed" | "shipped" | "delivered"
  totalAmount: number
  itemCount: number
  items: {
    productCode: string
    productName: string
    quantity: number
    unitPrice: number
    amount: number
  }[]
}

export function RestaurantOrderHistory() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<OrderHistoryItem | null>(null)

  const [orderHistory] = useState<OrderHistoryItem[]>([
    {
      id: "1",
      orderNumber: "ORD001",
      orderDate: "2024-01-15",
      status: "delivered",
      totalAmount: 4500,
      itemCount: 3,
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
        {
          productCode: "C001",
          productName: "醤油 / 간장",
          quantity: 0.625,
          unitPrice: 320,
          amount: 200,
        },
      ],
    },
    {
      id: "2",
      orderNumber: "ORD002",
      orderDate: "2024-01-14",
      status: "shipped",
      totalAmount: 1800,
      itemCount: 1,
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
    {
      id: "3",
      orderNumber: "ORD003",
      orderDate: "2024-01-13",
      status: "confirmed",
      totalAmount: 3200,
      itemCount: 3,
      items: [
        {
          productCode: "V001",
          productName: "キャベツ / 양배추",
          quantity: 8,
          unitPrice: 150,
          amount: 1200,
        },
        {
          productCode: "V002",
          productName: "人参 / 당근",
          quantity: 5,
          unitPrice: 120,
          amount: 600,
        },
        {
          productCode: "M002",
          productName: "豚肉 / 돼지고기",
          quantity: 0.778,
          unitPrice: 1800,
          amount: 1400,
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

  const filteredOrders = orderHistory.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || order.orderDate.includes(searchTerm),
  )

  const reorderItems = (order: OrderHistoryItem) => {
    // ここで再注文の処理を実装
    alert(`${order.orderNumber}の商品を再注文します`)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t.orderHistory}</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="注文番号・日付で検索 / 주문번호・날짜로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>注文履歴一覧 / 주문이력목록</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>注文番号</TableHead>
                    <TableHead>注文日</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>商品数</TableHead>
                    <TableHead>合計金額</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>{order.orderDate}</TableCell>
                      <TableCell>
                        <Badge className={statusOptions.find((s) => s.value === order.status)?.color}>
                          {statusOptions.find((s) => s.value === order.status)?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.itemCount}点</TableCell>
                      <TableCell>¥{order.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => reorderItems(order)}>
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          {selectedOrder ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>注文詳細 / 주문상세</span>
                  <Button size="sm" variant="ghost" onClick={() => setSelectedOrder(null)}>
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">注文番号</p>
                    <p className="font-medium">{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">注文日</p>
                    <p className="font-medium">{selectedOrder.orderDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ステータス</p>
                    <Badge className={statusOptions.find((s) => s.value === selectedOrder.status)?.color}>
                      {statusOptions.find((s) => s.value === selectedOrder.status)?.label}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">注文商品</p>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="p-2 border rounded text-sm">
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-gray-600">
                            {item.quantity} × ¥{item.unitPrice.toLocaleString()} = ¥{item.amount.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">合計:</span>
                      <span className="font-bold text-lg">¥{selectedOrder.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button onClick={() => reorderItems(selectedOrder)} className="w-full" variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    再注文
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>注文を選択して詳細を表示</p>
                <p className="text-sm">주문을 선택하여 상세보기</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
