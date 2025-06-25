"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useLanguage } from "@/components/language-provider"
import { ShoppingCart, Plus, Minus } from "lucide-react"

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
}

interface CartItem extends Product {
  quantity: number
}

export function RestaurantOrdering() {
  const { t } = useLanguage()
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
    },
  ])

  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)

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
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
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

  const handleCheckout = () => {
    // ここで注文処理を実装
    alert(`${t.order}: ¥${getTotalAmount().toLocaleString()}`)
    setCart([])
    setShowCart(false)
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
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>画像</TableHead>
                    <TableHead>{t.productCode}</TableHead>
                    <TableHead>{t.productName}</TableHead>
                    <TableHead>{t.category}</TableHead>
                    <TableHead>{t.unitPrice}</TableHead>
                    <TableHead>入数</TableHead>
                    <TableHead>{t.stock}</TableHead>
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
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.imageUrl || "/placeholder.svg?height=40&width=40"}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <p className="text-sm text-gray-500">
                              ¥{item.unitPrice.toLocaleString()} / {item.packSize}入
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold">{t.total}:</span>
                        <span className="font-bold text-lg">¥{getTotalAmount().toLocaleString()}</span>
                      </div>
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
