"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/components/language-provider"
import { Search, Building2, Send, Clock, CheckCircle } from "lucide-react"

interface Supplier {
  id: string
  code: string
  name: string
  nameKo?: string
  contactPerson: string
  phone: string
  email: string
  address: string
  description: string
  productCategories: string[]
  status: "available" | "requested" | "approved" | "rejected"
  requestDate?: string
}

interface PartnershipRequest {
  id: string
  supplierId: string
  supplierName: string
  requestDate: string
  status: "pending" | "approved" | "rejected"
  message: string
}

export function SupplierManagement() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"available" | "my-suppliers" | "requests">("available")
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [requestMessage, setRequestMessage] = useState("")

  const [suppliers] = useState<Supplier[]>([
    {
      id: "1",
      code: "WS001",
      name: "東京食材卸",
      nameKo: "도쿄식자재도매",
      contactPerson: "佐藤太郎",
      phone: "03-1111-2222",
      email: "sato@tokyo-foods.jp",
      address: "東京都中央区築地1-1-1",
      description: "新鮮な魚介類と野菜を中心に取り扱う老舗卸会社",
      productCategories: ["seafood", "vegetables"],
      status: "approved",
      requestDate: "2024-01-01",
    },
    {
      id: "2",
      code: "WS002",
      name: "関西肉類卸売",
      nameKo: "간사이육류도매",
      contactPerson: "田中花子",
      phone: "06-3333-4444",
      email: "tanaka@kansai-meat.jp",
      address: "大阪府大阪市中央区1-2-3",
      description: "高品質な国産肉を専門に扱う卸会社",
      productCategories: ["meat"],
      status: "available",
    },
    {
      id: "3",
      code: "WS003",
      name: "九州農産物流通",
      nameKo: "규슈농산물유통",
      contactPerson: "山田次郎",
      phone: "092-5555-6666",
      email: "yamada@kyushu-agri.jp",
      address: "福岡県福岡市博多区2-3-4",
      description: "九州産の新鮮な野菜と果物を全国に配送",
      productCategories: ["vegetables", "grains"],
      status: "requested",
      requestDate: "2024-01-10",
    },
  ])

  const [partnershipRequests] = useState<PartnershipRequest[]>([
    {
      id: "1",
      supplierId: "3",
      supplierName: "九州農産物流通",
      requestDate: "2024-01-10",
      status: "pending",
      message: "新鮮な九州産野菜の仕入れを希望します。",
    },
  ])

  const categoryLabels = {
    vegetables: t.vegetables,
    meat: t.meat,
    seafood: t.seafood,
    dairy: t.dairy,
    grains: t.grains,
    condiments: t.condiments,
  }

  const handleRequestPartnership = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setIsRequestDialogOpen(true)
  }

  const handleSendRequest = () => {
    if (selectedSupplier) {
      // ここで取引申請の処理を実装
      alert(`${selectedSupplier.name}に取引申請を送信しました`)
      setIsRequestDialogOpen(false)
      setRequestMessage("")
      setSelectedSupplier(null)
    }
  }

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())

    switch (activeTab) {
      case "available":
        return matchesSearch && supplier.status === "available"
      case "my-suppliers":
        return matchesSearch && supplier.status === "approved"
      case "requests":
        return matchesSearch && (supplier.status === "requested" || supplier.status === "rejected")
      default:
        return matchesSearch
    }
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">利用可能</Badge>
      case "requested":
        return <Badge className="bg-yellow-100 text-yellow-800">申請中</Badge>
      case "approved":
        return <Badge className="bg-blue-100 text-blue-800">取引中</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">拒否</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">{t.supplierManagement}</h2>
          <p className="text-gray-600">{t.supplierManagementDescription}</p>
        </div>
      </div>

      {/* タブ */}
      <div className="flex space-x-4 mb-6">
        <Button
          variant={activeTab === "available" ? "default" : "outline"}
          onClick={() => setActiveTab("available")}
          className="flex items-center space-x-2"
        >
          <Building2 className="h-4 w-4" />
          <span>{t.availableSuppliers}</span>
        </Button>
        <Button
          variant={activeTab === "my-suppliers" ? "default" : "outline"}
          onClick={() => setActiveTab("my-suppliers")}
          className="flex items-center space-x-2"
        >
          <CheckCircle className="h-4 w-4" />
          <span>{t.mySuppliers}</span>
        </Button>
        <Button
          variant={activeTab === "requests" ? "default" : "outline"}
          onClick={() => setActiveTab("requests")}
          className="flex items-center space-x-2"
        >
          <Clock className="h-4 w-4" />
          <span>{t.partnershipRequests}</span>
        </Button>
      </div>

      {/* 検索 */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="卸会社名・コード・担当者で検索"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>卸会社コード</TableHead>
                <TableHead>卸会社名</TableHead>
                <TableHead>担当者</TableHead>
                <TableHead>連絡先</TableHead>
                <TableHead>取扱カテゴリー</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.code}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{supplier.name}</p>
                      {supplier.nameKo && <p className="text-sm text-gray-500">{supplier.nameKo}</p>}
                      <p className="text-xs text-gray-400 mt-1">{supplier.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>{supplier.contactPerson}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{supplier.phone}</p>
                      <p className="text-gray-500">{supplier.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {supplier.productCategories.map((category) => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {categoryLabels[category as keyof typeof categoryLabels]}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(supplier.status)}</TableCell>
                  <TableCell>
                    {supplier.status === "available" && (
                      <Button
                        size="sm"
                        onClick={() => handleRequestPartnership(supplier)}
                        className="flex items-center space-x-1"
                      >
                        <Send className="h-4 w-4" />
                        <span>申請</span>
                      </Button>
                    )}
                    {supplier.status === "approved" && (
                      <Button size="sm" variant="outline" disabled>
                        取引中
                      </Button>
                    )}
                    {supplier.status === "requested" && (
                      <Button size="sm" variant="outline" disabled>
                        申請中
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 取引申請ダイアログ */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.partnershipRequest}</DialogTitle>
          </DialogHeader>
          {selectedSupplier && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded">
                <h3 className="font-medium">{selectedSupplier.name}</h3>
                <p className="text-sm text-gray-600">{selectedSupplier.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedSupplier.productCategories.map((category) => (
                    <Badge key={category} variant="outline" className="text-xs">
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">申請メッセージ</label>
                <textarea
                  className="w-full p-3 border rounded-md resize-none"
                  rows={4}
                  placeholder="取引を希望する理由や要望を入力してください"
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSendRequest} className="flex-1">
                  申請送信
                </Button>
                <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)} className="flex-1">
                  キャンセル
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
