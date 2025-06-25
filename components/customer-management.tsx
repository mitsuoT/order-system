"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { Plus, Edit, Trash2, Check, X, Search, Users } from "lucide-react"

interface Customer {
  id: string
  code: string
  name: string
  nameKo?: string
  contactPerson: string
  phone: string
  email: string
  address: string
  status: "pending" | "approved" | "rejected" | "active" | "inactive"
  registrationDate: string
  lastOrderDate?: string
  totalOrders: number
  totalAmount: number
}

export function CustomerManagement() {
  const { t } = useLanguage()
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      code: "REST001",
      name: "レストラン田中",
      nameKo: "다나카 레스토랑",
      contactPerson: "田中太郎",
      phone: "03-1234-5678",
      email: "tanaka@restaurant.jp",
      address: "東京都渋谷区1-1-1",
      status: "active",
      registrationDate: "2024-01-01",
      lastOrderDate: "2024-01-15",
      totalOrders: 25,
      totalAmount: 125000,
    },
    {
      id: "2",
      code: "REST002",
      name: "カフェ山田",
      nameKo: "야마다 카페",
      contactPerson: "山田花子",
      phone: "03-2345-6789",
      email: "yamada@cafe.jp",
      address: "東京都新宿区2-2-2",
      status: "active",
      registrationDate: "2024-01-05",
      lastOrderDate: "2024-01-14",
      totalOrders: 18,
      totalAmount: 89000,
    },
    {
      id: "3",
      code: "REST003",
      name: "韓国料理店김씨",
      nameKo: "김씨 한국요리점",
      contactPerson: "김철수",
      phone: "03-3456-7890",
      email: "kim@korean.jp",
      address: "東京都池袋区3-3-3",
      status: "pending",
      registrationDate: "2024-01-10",
      totalOrders: 0,
      totalAmount: 0,
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    nameKo: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
  })

  const statusOptions = [
    { value: "pending", label: t.pending, color: "bg-yellow-100 text-yellow-800" },
    { value: "approved", label: t.approved, color: "bg-green-100 text-green-800" },
    { value: "active", label: t.active, color: "bg-blue-100 text-blue-800" },
    { value: "inactive", label: t.inactive, color: "bg-gray-100 text-gray-800" },
    { value: "rejected", label: t.rejected, color: "bg-red-100 text-red-800" },
  ]

  const handleAddCustomer = () => {
    setEditingCustomer(null)
    setFormData({
      code: "",
      name: "",
      nameKo: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormData({
      code: customer.code,
      name: customer.name,
      nameKo: customer.nameKo || "",
      contactPerson: customer.contactPerson,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
    })
    setIsDialogOpen(true)
  }

  const handleSaveCustomer = () => {
    if (editingCustomer) {
      setCustomers(
        customers.map((c) =>
          c.id === editingCustomer.id
            ? {
                ...c,
                code: formData.code,
                name: formData.name,
                nameKo: formData.nameKo,
                contactPerson: formData.contactPerson,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
              }
            : c,
        ),
      )
    } else {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        code: formData.code,
        name: formData.name,
        nameKo: formData.nameKo,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        status: "pending",
        registrationDate: new Date().toISOString().split("T")[0],
        totalOrders: 0,
        totalAmount: 0,
      }
      setCustomers([...customers, newCustomer])
    }
    setIsDialogOpen(false)
  }

  const handleDeleteCustomer = (id: string) => {
    setCustomers(customers.filter((c) => c.id !== id))
  }

  const handleApproveCustomer = (id: string) => {
    setCustomers(customers.map((c) => (c.id === id ? { ...c, status: "approved" as const } : c)))
  }

  const handleRejectCustomer = (id: string) => {
    setCustomers(customers.map((c) => (c.id === id ? { ...c, status: "rejected" as const } : c)))
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingCount = customers.filter((c) => c.status === "pending").length
  const activeCount = customers.filter((c) => c.status === "active").length
  const totalAmount = customers.reduce((sum, c) => sum + c.totalAmount, 0)

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">{t.customerManagement}</h2>
          <p className="text-gray-600">{t.customerManagementDescription}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddCustomer} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>{t.addCustomer}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCustomer ? t.editCustomer : t.addCustomer}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="code">{t.customerCode}</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="name">{t.customerName} (日本語)</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="nameKo">{t.customerName} (한국어)</Label>
                <Input
                  id="nameKo"
                  value={formData.nameKo}
                  onChange={(e) => setFormData({ ...formData, nameKo: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="contactPerson">{t.contactPerson}</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">{t.phone}</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">{t.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="address">{t.address}</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSaveCustomer} className="flex-1">
                  {t.save}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  {t.cancel}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
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
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold">{pendingCount}</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">承認待ち</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">{activeCount}</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">取引中</p>
                <p className="text-2xl font-bold">{activeCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-600">総取引額</p>
              <p className="text-2xl font-bold">¥{totalAmount.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* フィルター */}
      <div className="flex space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="得意先名・コード・担当者で検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="ステータスで絞り込み" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.customerCode}</TableHead>
                <TableHead>{t.customerName}</TableHead>
                <TableHead>{t.contactPerson}</TableHead>
                <TableHead>{t.phone}</TableHead>
                <TableHead>{t.email}</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>総注文数</TableHead>
                <TableHead>総取引額</TableHead>
                <TableHead>{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.code}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      {customer.nameKo && <p className="text-sm text-gray-500">{customer.nameKo}</p>}
                    </div>
                  </TableCell>
                  <TableCell>{customer.contactPerson}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    <Badge className={statusOptions.find((s) => s.value === customer.status)?.color}>
                      {statusOptions.find((s) => s.value === customer.status)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell>¥{customer.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {customer.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApproveCustomer(customer.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectCustomer(customer.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button variant="outline" size="sm" onClick={() => handleEditCustomer(customer)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteCustomer(customer.id)}>
                        <Trash2 className="h-4 w-4" />
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
  )
}
