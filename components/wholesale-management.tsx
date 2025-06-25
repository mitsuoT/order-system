"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useLanguage } from "@/components/language-provider"
import { Plus, Edit, Trash2 } from "lucide-react"

interface Product {
  id: string
  code: string
  name: string
  category: string
  unitPrice: number
  costPrice: number // 追加
  packSize: number // 追加（入数）
  stock: number
  unit: string
  imageUrl?: string // 追加
}

export function WholesaleManagement() {
  const { t } = useLanguage()
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      code: "V001",
      name: "キャベツ / 양배추",
      category: "vegetables",
      unitPrice: 150,
      costPrice: 100,
      packSize: 1,
      stock: 50,
      unit: "kg",
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "2",
      code: "M001",
      name: "牛肉 / 소고기",
      category: "meat",
      unitPrice: 2800,
      costPrice: 2500,
      packSize: 1,
      stock: 20,
      unit: "kg",
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "3",
      code: "S001",
      name: "サーモン / 연어",
      category: "seafood",
      unitPrice: 1200,
      costPrice: 1000,
      packSize: 1,
      stock: 15,
      unit: "kg",
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    category: "",
    unitPrice: "",
    costPrice: "",
    packSize: "",
    stock: "",
    unit: "",
    imageUrl: "",
  })

  const categories = [
    { value: "vegetables", label: t.vegetables },
    { value: "meat", label: t.meat },
    { value: "seafood", label: t.seafood },
    { value: "dairy", label: t.dairy },
    { value: "grains", label: t.grains },
    { value: "condiments", label: t.condiments },
  ]

  const units = [
    { value: "kg", label: t.kg },
    { value: "piece", label: t.piece },
    { value: "pack", label: t.pack },
    { value: "liter", label: t.liter },
  ]

  const handleAddProduct = () => {
    setEditingProduct(null)
    setFormData({
      code: "",
      name: "",
      category: "",
      unitPrice: "",
      costPrice: "",
      packSize: "",
      stock: "",
      unit: "",
      imageUrl: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      code: product.code,
      name: product.name,
      category: product.category,
      unitPrice: product.unitPrice.toString(),
      costPrice: (product.costPrice || 0).toString(),
      packSize: (product.packSize || 1).toString(),
      stock: product.stock.toString(),
      unit: product.unit,
      imageUrl: product.imageUrl || "",
    })
    setIsDialogOpen(true)
  }

  const handleSaveProduct = () => {
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                code: formData.code,
                name: formData.name,
                category: formData.category,
                unitPrice: Number.parseFloat(formData.unitPrice),
                costPrice: Number.parseFloat(formData.costPrice),
                packSize: Number.parseInt(formData.packSize),
                stock: Number.parseInt(formData.stock),
                unit: formData.unit,
                imageUrl: formData.imageUrl,
              }
            : p,
        ),
      )
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        code: formData.code,
        name: formData.name,
        category: formData.category,
        unitPrice: Number.parseFloat(formData.unitPrice),
        costPrice: Number.parseFloat(formData.costPrice),
        packSize: Number.parseInt(formData.packSize),
        stock: Number.parseInt(formData.stock),
        unit: formData.unit,
        imageUrl: formData.imageUrl,
      }
      setProducts([...products, newProduct])
    }
    setIsDialogOpen(false)
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData({ ...formData, imageUrl: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t.wholesaleManagement}</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddProduct} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>{t.addProduct}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingProduct ? t.editProduct : t.addProduct}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="code">{t.productCode}</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="name">{t.productName}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">{t.category}</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="image">商品画像 / 상품이미지</Label>
                <div className="space-y-2">
                  <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} />
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl || "/placeholder.svg"}
                      alt="商品画像"
                      className="w-20 h-20 object-cover rounded border"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="costPrice">原価 / 원가</Label>
                <Input
                  id="costPrice"
                  type="number"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="packSize">入数 / 입수</Label>
                <Input
                  id="packSize"
                  type="number"
                  value={formData.packSize}
                  onChange={(e) => setFormData({ ...formData, packSize: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="unitPrice">{t.unitPrice}</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="stock">{t.stock}</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="unit">{t.unit}</Label>
                <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSaveProduct} className="flex-1">
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

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>画像</TableHead>
                <TableHead>{t.productCode}</TableHead>
                <TableHead>{t.productName}</TableHead>
                <TableHead>{t.category}</TableHead>
                <TableHead>原価</TableHead>
                <TableHead>{t.unitPrice}</TableHead>
                <TableHead>入数</TableHead>
                <TableHead>{t.stock}</TableHead>
                <TableHead>{t.unit}</TableHead>
                <TableHead>{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.imageUrl || "/placeholder.svg?height=50&width=50"}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.code}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{categories.find((cat) => cat.value === product.category)?.label}</TableCell>
                  <TableCell>¥{product.costPrice.toLocaleString()}</TableCell>
                  <TableCell>¥{product.unitPrice.toLocaleString()}</TableCell>
                  <TableCell>{product.packSize}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{units.find((unit) => unit.value === product.unit)?.label}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id)}>
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
