"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useLanguage } from "@/components/language-provider"
import { Users, Building2, Phone, Mail, MapPin } from "lucide-react"

interface Customer {
  id: string
  code: string
  name: string
  nameKo: string
  contactPerson: string
  phone: string
  email: string
  address: string
  status: "active" | "pending" | "inactive"
  registrationDate: string
  lastOrderDate?: string
  totalOrders: number
  totalAmount: number
}

export function CustomerManagement() {
  const { t } = useLanguage()
  const [customers] = useState<Customer[]>([
    {
      id: "1",
      code: "REST001",
      name: "レストラン田中",
      nameKo: "다나카 레스토랑",
      contactPerson: "田中太郎",
      phone: "03-1234-5678",
      email: "tanaka@restaurant.com",
      address: "東京都渋谷区...",
      status: "active",
      registrationDate: "2024-01-15",
      lastOrderDate: "2024-12-20",
      totalOrders: 45,
      totalAmount: 1250000,
    },
    {
      id: "2",
      code: "REST002",
      name: "カフェ山田",
      nameKo: "야마다 카페",
      contactPerson: "山田花子",
      phone: "03-2345-6789",
      email: "yamada@cafe.com",
      address: "東京都新宿区...",
      status: "active",
      registrationDate: "2024-02-10",
      lastOrderDate: "2024-12-18",
      totalOrders: 32,
      totalAmount: 890000,
    },
    {
      id: "3",
      code: "REST003",
      name: "居酒屋佐藤",
      nameKo: "사토 이자카야",
      contactPerson: "佐藤次郎",
      phone: "03-3456-7890",
      email: "sato@izakaya.com",
      address: "東京都品川区...",
      status: "pending",
      registrationDate: "2024-12-15",
      totalOrders: 0,
      totalAmount: 0,
    },
  ])

  const statusOptions = [
    { value: "active", label: "取引中", color: "bg-green-100 text-green-800" },
    { value: "pending", label: "承認待ち", color: "bg-yellow-100 text-yellow-800" },
    { value: "inactive", label: "取引停止", color: "bg-red-100 text-red-800" },
  ]

  const activeCustomers = customers.filter((c) => c.status === "active").length
  const pendingCustomers = customers.filter((c) => c.status === "pending").length
  const totalAmount = customers.reduce((sum, c) => sum + c.totalAmount, 0)

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t.customerManagement}</h2>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">総得意先数</p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">取引中</p>
                <p className="text-2xl font-bold">{activeCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">承認待ち</p>
                <p className="text-2xl font-bold">{pendingCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">総取引額</p>
                <p className="text-2xl font-bold">¥{totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>得意先一覧</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>得意先コード</TableHead>
                <TableHead>店舗名</TableHead>
                <TableHead>担当者</TableHead>
                <TableHead>連絡先</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>登録日</TableHead>
                <TableHead>最終注文日</TableHead>
                <TableHead>注文回数</TableHead>
                <TableHead>取引額</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.code}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.nameKo}</div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.contactPerson}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span className="text-sm">{customer.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span className="text-sm">{customer.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusOptions.find((s) => s.value === customer.status)?.color}>
                      {statusOptions.find((s) => s.value === customer.status)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.registrationDate}</TableCell>
                  <TableCell>{customer.lastOrderDate || "-"}</TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell>¥{customer.totalAmount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
