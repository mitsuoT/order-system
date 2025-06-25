"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Package } from "lucide-react"
import { supabase, isDemo, type Product } from "@/lib/database"

interface ProductSearchProps {
  language: "ja" | "ko" | "en"
  onProductSelect?: (product: Product) => void
}

// Demo data for when Supabase is not configured
const demoProducts: Product[] = [
  {
    id: "1",
    code: "PROD001",
    name: "Premium Rice",
    name_jp: "高級米",
    name_kr: "프리미엄 쌀",
    price: 2500.0,
    cost: 1800.0,
    unit: "kg",
    category: "grain",
    stock_quantity: 100,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    code: "PROD002",
    name: "Fresh Vegetables",
    name_jp: "新鮮野菜",
    name_kr: "신선 야채",
    price: 800.0,
    cost: 600.0,
    unit: "pack",
    category: "vegetable",
    stock_quantity: 50,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    code: "PROD003",
    name: "Soy Sauce",
    name_jp: "醤油",
    name_kr: "간장",
    price: 450.0,
    cost: 300.0,
    unit: "bottle",
    category: "seasoning",
    stock_quantity: 200,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    code: "PROD004",
    name: "Kimchi",
    name_jp: "キムチ",
    name_kr: "김치",
    price: 1200.0,
    cost: 900.0,
    unit: "pack",
    category: "pickle",
    stock_quantity: 30,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function ProductSearch({ language, onProductSelect }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  const texts = {
    ja: {
      title: "商品検索",
      placeholder: "商品名またはコードで検索...",
      search: "検索",
      noResults: "商品が見つかりません",
      price: "価格",
      stock: "在庫",
      category: "カテゴリー",
      demoMode: "デモモード",
    },
    ko: {
      title: "상품 검색",
      placeholder: "상품명 또는 코드로 검색...",
      search: "검색",
      noResults: "상품을 찾을 수 없습니다",
      price: "가격",
      stock: "재고",
      category: "카테고리",
      demoMode: "데모 모드",
    },
    en: {
      title: "Product Search",
      placeholder: "Search by product name or code...",
      search: "Search",
      noResults: "No products found",
      price: "Price",
      stock: "Stock",
      category: "Category",
      demoMode: "Demo Mode",
    },
  }

  const t = texts[language]

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter((product) => {
        const searchLower = searchTerm.toLowerCase()
        return (
          product.name.toLowerCase().includes(searchLower) ||
          product.name_jp?.toLowerCase().includes(searchLower) ||
          product.name_kr?.toLowerCase().includes(searchLower) ||
          product.code.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
        )
      })
      setFilteredProducts(filtered)
    }
  }, [searchTerm, products])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      if (isDemo) {
        // Use demo data
        setProducts(demoProducts)
        setFilteredProducts(demoProducts)
      } else {
        const { data, error } = await supabase.from("products").select("*").eq("is_active", true).order("name")

        if (error) throw error
        setProducts(data || [])
        setFilteredProducts(data || [])
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      // Fallback to demo data on error
      setProducts(demoProducts)
      setFilteredProducts(demoProducts)
    } finally {
      setLoading(false)
    }
  }

  const getProductName = (product: Product) => {
    switch (language) {
      case "ja":
        return product.name_jp || product.name
      case "ko":
        return product.name_kr || product.name
      default:
        return product.name
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {t.title}
            {isDemo && <Badge variant="outline">{t.demoMode}</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder={t.placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button onClick={fetchProducts} disabled={loading}>
              {t.search}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onProductSelect?.(product)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{product.code}</span>
                </div>
                <Badge variant={product.stock_quantity > 0 ? "default" : "destructive"}>
                  {t.stock}: {product.stock_quantity}
                </Badge>
              </div>

              <h3 className="font-semibold mb-2">{getProductName(product)}</h3>

              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>{t.price}:</span>
                  <span className="font-medium">¥{product.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.category}:</span>
                  <span>{product.category}</span>
                </div>
                {product.unit && (
                  <div className="flex justify-between">
                    <span>単位:</span>
                    <span>{product.unit}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">{t.noResults}</div>
      )}
    </div>
  )
}
