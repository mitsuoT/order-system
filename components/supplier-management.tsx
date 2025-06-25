"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useLanguage } from "@/components/language-provider"
import { Building2, Phone, Mail, MapPin, Send } from "lucide-react"

interface Supplier {
  id: string
  code: string
  name: string
  nameKo: string
  contactPerson: string
  phone: string
  email: string
  address: string
  categories: string[]
  status: "available" | "requested" | "approved" | "rejected"
  requestDate?: string
  approvalDate?: string
  totalOrders: number
  totalAmount: number
}

export function SupplierManagement() {
  const { t } = useLanguage()
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: "1",
      code: "WHOLE001",
      name: "田中食品卸",
      nameKo: "다나카 식품 도매",
      contactPerson: "田中商事",
      phone: "03-1111-2222",
      email: "info@tanaka-foods.com",
      address: "東京都中央区築地...",
      categories: ["vegetables", "meat", "seafood"],
      status: "approved",
      requestDate: "2024-01-10",
      approvalDate: "2024-01-12",
      totalOrders: 25,
      totalAmount: 850000,
    },
    {
      id: "2",
      code: "WHOLE002",
      name: "山田水産",
      nameKo: "야마다 수산",
      contactPerson: "山田太郎",
      phone: "03-2222-3333",
      email: "info@yamada-suisan.com",
      address: "東京都江東区豊洲...",
      categories: ["seafood"],
      status: "approved",
      requestDate: "2024-02-05",
      approvalDate: "2024-02-07",
      totalOrders: 18,
      totalAmount: 620000,
    },
    {
      id: "3",
      code: "WHOLE003",
      name: "佐藤青果",
      nameKo: "사토 청과",
      contactPerson: "佐藤花子",
      phone: "03-3333-4444",
      email: "info@sato-seika.com",
      address: "東京都大田区大森...",
      categories: ["vegetables", "grains"],
      status: "available",
      totalOrders: 0,
      totalAmount: 0,
    },
    {
      id: "4",
      code: "WHOLE004",
      name: "鈴木畜産",
      nameKo: "스즈키 축산",
      contactPerson: "鈴木次郎",
      phone: "03-4444-5555",
      email: "info@suzuki-meat.com",
      address: "東京都品川区...",
      categories: ["meat", "dairy"],
      status: "requested",
      requestDate: "2024-12-15",
      totalOrders: 0,
      totalAmount: 0,
    },
  ])

  const categories = [
    { value: "vegetables", label: t.vegetables, color: "bg-green-100 text-green-800" },
    { value: "meat", label: t.meat, color: "bg-red-100 text-red-800" },
    { value: "seafood", label: t.seafood, color: "bg-blue-100 text-blue-800" },
    { value: "dairy", label: t.dairy, color: "bg-yellow-100 text-yellow-800" },
    { value: "grains", label: t.grains, color: "bg-orange-100 text-orange-800" },
    { value: "condiments", label: t.condiments, color: "bg-purple-100 text-purple-800" },
  ]

  const statusOptions = [
    { value: "available", label: "利用可能", color: "bg-gray-100 text-gray-800" },
    { value: "requested", label: "申請中", color: "bg-yellow-100 text-yellow-800" },
    { value: "approved", label: "承認済み", color: "bg-green-100 text-green-800" },
    { value: "rejected", label: "拒否", color: "bg-red-100 text-red-800" },
  ]

  const handleRequestPartnership = (supplierId: string) => {
    setSuppliers(
      suppliers.map((supplier) =>
        supplier.id === supplierId
          ? {
              ...supplier,
              status: "requested" as const,
              requestDate: new Date().toISOString().split("T")[0],
            }
          : supplier,
      ),
    )
  }

  const approvedSuppliers = suppliers.filter((s) => s.status === "approved").length
  const requestedSuppliers = suppliers.filter((s) => s.status === "requested").length
  const totalAmount = suppliers.reduce((sum, s) => sum + s.totalAmount, 0)

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t.supplierManagement}</h2>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">利用可能業者</p>
                <p className="text-2xl font-bold">{suppliers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">取引中</p>
                <p className="text-2xl font-bold">{approvedSuppliers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">申請中</p>
                <p className="text-2xl font-bold">{requestedSuppliers}</p>
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
          <CardTitle>仕入先一覧</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>業者コード</TableHead>
                <TableHead>業者名</TableHead>
                <TableHead>担当者</TableHead>
                <TableHead>取扱カテゴリー</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>申請日</TableHead>
                <TableHead>承認日</TableHead>
                <TableHead>注文回数</TableHead>
                <TableHead>取引額</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.code}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{supplier.name}</div>
                      <div className="text-sm text-gray-500">{supplier.nameKo}</div>
                    </div>
                  </TableCell>
                  <TableCell>{supplier.contactPerson}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {supplier.categories.map((cat) => (
                        <Badge key={cat} className={categories.find((c) => c.value === cat)?.color} variant="secondary">
                          {categories.find((c) => c.value === cat)?.label}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusOptions.find((s) => s.value === supplier.status)?.color}>
                      {statusOptions.find((s) => s.value === supplier.status)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>{supplier.requestDate || "-"}</TableCell>
                  <TableCell>{supplier.approvalDate || "-"}</TableCell>
                  <TableCell>{supplier.totalOrders}</TableCell>
                  <TableCell>¥{supplier.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    {supplier.status === "available" && (
                      <Button size="sm" onClick={() => handleRequestPartnership(supplier.id)}>
                        <Send className="h-4 w-4 mr-1" />
                        申請
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
