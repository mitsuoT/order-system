"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useLanguage } from "@/components/language-provider"
import { ShoppingCart, Plus, Minus, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Supplier {
  id: string
  code: string
  name: string
  nameKo: string
  categories: string[]
  status: string
}

interface Product {
  id: string
  code: string
  name: string
  category: string
  unitPrice: number
  costPrice: number
  packSize: number
  stock: number
  unit: string
  imageUrl?: string
  supplierId: string
}

interface CartItem extends Product {
  quantity: number
  supplierName: string
}

export function RestaurantOrdering() {
  const { t, language } = useLanguage()

  // 承認済み仕入先データ
  const [suppliers] = useState<Supplier[]>([
    {
      id: "ws001",
      code: "WS001",
      name: "東京食材卸",
      nameKo: "도쿄식자재도매",
      categories: ["seafood", "vegetables"],
      status: "approved",
    },
    {
      id: "ws002",
      code: "WS002",
      name: "関西肉類卸売",
      nameKo: "간사이육류도매",
      categories: ["meat"],
      status: "approved",
    },
    {
      id: "ws003",
      code: "WS003",
      name: "九州農産物流通",
      nameKo: "규슈농산물유통",
      categories: ["vegetables", "grains"],
      status: "approved",
    },
  ])

  const [products] = useState<Product[]>([
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
      supplierId: "ws001",
    },
    {
      id: "2",
      code: "M001",
      name: "牛肉 / 소고기",
      category: "meat",
      unitPrice: 2800,
      costPrice: 2000,
      packSize: 1,
      stock: 20,
      unit: "kg",
      imageUrl: "/placeholder.svg?height=100&width=100",
      supplierId: "ws002",
    },
    {
      id: "3",
      code: "S001",
      name: "サーモン / 연어",
      category: "seafood",
      unitPrice: 1200,
      costPrice: 800,
      packSize: 1,
      stock: 15,
      unit: "kg",
      imageUrl: "/placeholder.svg?height=100&width=100",
      supplierId: "ws001",
    },
    {
      id: "4",
      code: "V002",
      name: "人参 / 당근",
      category: "vegetables",
      unitPrice: 120,
      costPrice: 80,
      packSize: 1,
      stock: 30,
      unit: "kg",
      imageUrl: "/placeholder.svg?height=100&width=100",
      supplierId: "ws003",
    },
  ])

  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedSupplier, setSelectedSupplier] = useState<string>("all")

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

  const addToCart = (product: Product) => {
    const supplier = suppliers.find((s) => s.id === product.supplierId)
    const supplierName = language === "ja" ? supplier?.name : supplier?.nameKo

    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...product, quantity: 1, supplierName: supplierName || "" }])
    }
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter((item) => item.id !== id))
    } else {
      setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.unitPrice * item.quantity, 0)
  }

  const getCartBySupplier = () => {
    const cartBySupplier: { [key: string]: CartItem[] } = {}
    cart.forEach((item) => {
      if (!cartBySupplier[item.supplierId]) {
        cartBySupplier[item.supplierId] = []
      }
      cartBySupplier[item.supplierId].push(item)
    })
    return cartBySupplier
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("カートが空です / 장바구니가 비어있습니다")
      return
    }

    const cartBySupplier = getCartBySupplier()
    const orderSummary = Object.keys(cartBySupplier)
      .map((supplierId) => {
        const supplier = suppliers.find((s) => s.id === supplierId)
        const supplierName = language === "ja" ? supplier?.name : supplier?.nameKo
        const items = cartBySupplier[supplierId]
        const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

        return `${supplierName}: ¥${total.toLocaleString()}`
      })
      .join("\n")

    alert(`${t.order}:\n${orderSummary}\n\n${t.total}: ¥${getTotalAmount().toLocaleString()}`)
    setCart([])
    setShowCart(false)
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesSupplier = selectedSupplier === "all" || product.supplierId === selectedSupplier
    return matchesSearch && matchesCategory && matchesSupplier
  })

  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers.find((s) => s.id === supplierId)
    return language === "ja" ? supplier?.name : supplier?.nameKo
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t.restaurantOrdering}</h2>
        <Button
          onClick={() => setShowCart(!showCart)}
          className="flex items-center space-x-2"
          variant={showCart ? "default" : "outline"}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>
            {t.cart} ({cart.length})
          </span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>商品一覧 / 상품목록</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* 検索・フィルターエリア */}
              <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder={`${t.searchPlaceholder} / 상품명・상품코드로 검색`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="w-full sm:w-48">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder={t.allCategories} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t.allCategories} / 전체 카테고리</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full sm:w-48">
                    <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                      <SelectTrigger>
                        <SelectValue placeholder={t.selectSupplier} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全仕入先 / 전체 공급업체</SelectItem>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {language === "ja" ? supplier.name : supplier.nameKo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {filteredProducts.length}
                  {t.productsFound} / {filteredProducts.length}개의 상품을 찾았습니다
                </div>
              </div>

              {/* テーブル */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>画像</TableHead>
                    <TableHead>{t.productCode}</TableHead>
                    <TableHead>{t.productName}</TableHead>
                    <TableHead>仕入先</TableHead>
                    <TableHead>{t.category}</TableHead>
                    <TableHead>{t.unitPrice}</TableHead>
                    <TableHead>入数</TableHead>
                    <TableHead>{t.stock}</TableHead>
                    <TableHead>{t.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
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
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {getSupplierName(product.supplierId)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {categories.find((cat) => cat.value === product.category)?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>¥{product.unitPrice.toLocaleString()}</TableCell>
                      <TableCell>
                        {product.packSize}
                        {units.find((unit) => unit.value === product.unit)?.label}
                      </TableCell>
                      <TableCell>
                        {product.stock} {units.find((unit) => unit.value === product.unit)?.label}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => addToCart(product)} disabled={product.stock === 0}>
                          {t.addToCart}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {showCart && (
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{t.cart}</CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">カートは空です / 장바구니가 비어있습니다</p>
                ) : (
                  <div className="space-y-4">
                    {/* 仕入先別にグループ化して表示 */}
                    {Object.entries(getCartBySupplier()).map(([supplierId, items]) => {
                      const supplier = suppliers.find((s) => s.id === supplierId)
                      const supplierName = language === "ja" ? supplier?.name : supplier?.nameKo
                      const supplierTotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

                      return (
                        <div key={supplierId} className="border rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2 pb-2 border-b">
                            <h4 className="font-medium text-sm text-blue-600">{supplierName}</h4>
                            <span className="text-sm font-medium">¥{supplierTotal.toLocaleString()}</span>
                          </div>
                          <div className="space-y-2">
                            {items.map((item) => (
                              <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center space-x-2">
                                  <img
                                    src={item.imageUrl || "/placeholder.svg?height=30&width=30"}
                                    alt={item.name}
                                    className="w-8 h-8 object-cover rounded"
                                  />
                                  <div className="flex-1">
                                    <h5 className="font-medium text-xs">{item.name}</h5>
                                    <p className="text-xs text-gray-500">
                                      ¥{item.unitPrice.toLocaleString()} / {item.packSize}入
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-6 text-center text-xs">{item.quantity}</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold">{t.total}:</span>
                        <span className="font-bold text-lg">¥{getTotalAmount().toLocaleString()}</span>
                      </div>

                      {Object.keys(getCartBySupplier()).length > 1 && (
                        <Alert className="mb-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-sm">
                            複数の仕入先からの注文です。仕入先ごとに個別の注文として処理されます。
                            <br />
                            여러 공급업체의 주문입니다. 공급업체별로 개별 주문으로 처리됩니다.
                          </AlertDescription>
                        </Alert>
                      )}

                      <Button onClick={handleCheckout} className="w-full">
                        {t.checkout}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
