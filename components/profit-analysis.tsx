"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"

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

interface ProfitAnalysisProps {
  products: Product[]
}

export function ProfitAnalysis({ products }: ProfitAnalysisProps) {
  const { t } = useLanguage()

  const calculateProfit = (product: Product) => {
    return product.unitPrice - product.costPrice
  }

  const calculateProfitRate = (product: Product) => {
    if (product.costPrice === 0) return 0
    return ((product.unitPrice - product.costPrice) / product.costPrice) * 100
  }

  const sortedByProfitRate = [...products].sort((a, b) => calculateProfitRate(b) - calculateProfitRate(a))
  const highProfitProducts = sortedByProfitRate.slice(0, 3)
  const lowProfitProducts = sortedByProfitRate.slice(-3).reverse()

  const totalProfit = products.reduce((sum, product) => sum + calculateProfit(product) * product.stock, 0)
  const averageProfitRate = products.reduce((sum, product) => sum + calculateProfitRate(product), 0) / products.length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総利益ポテンシャル</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{totalProfit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">在庫×利益の合計</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均利益率</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageProfitRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">全商品の平均</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">商品数</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">登録商品総数</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>高利益率商品 TOP3</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {highProfitProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">#{index + 1}</Badge>
                    <img
                      src={product.imageUrl || "/placeholder.svg?height=40&width=40"}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.code}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{calculateProfitRate(product).toFixed(1)}%</p>
                    <p className="text-xs text-gray-500">¥{calculateProfit(product).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <span>低利益率商品 TOP3</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowProfitProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">#{index + 1}</Badge>
                    <img
                      src={product.imageUrl || "/placeholder.svg?height=40&width=40"}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.code}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{calculateProfitRate(product).toFixed(1)}%</p>
                    <p className="text-xs text-gray-500">¥{calculateProfit(product).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
