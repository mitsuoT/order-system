import type { Order, OrderDetail, Product } from "./database"

// PCA商魂・商管シリーズ 売上明細データフォーマット
export interface PCAOrderDetailData {
  伝区: string // 0:掛売
  売上日: string // YYYYMMDD
  請求日: string // YYYYMMDD
  伝票No: string // 8桁
  得意先コード: string // 13桁
  得意先名: string // 40文字
  直送先コード: string // 13桁
  直送先名: string // 40文字
  先方担当者名: string // 30文字
  部門コード: string // 6桁
  担当者コード: string // 13桁
  摘要コード: string // 6桁
  摘要名: string // 30文字
  分類コード: string // 4桁
  伝票区分: string // 2桁
  商品コード: string // 13桁
  マスター区分: string // 0:一般商品
  商品名: string // 36文字
  区: string // 0:売上
  倉庫コード: string // 6桁
  入数: string // 10桁
  箱数: string // 11桁
  数量: string // 9桁
  単位: string // 4文字
  単価: string // 10桁
  売上金額: string // 11桁
  原単価: string // 9桁
  原価金額: string // 11桁
  粗利益: string // 11桁（計算項目）
  外税額: string // 11桁（計算項目）
  内税額: string // 11桁（計算項目）
  税区分: string // 2:標準税率
  税込区分: string // 0:税抜
  備考: string // 20文字
  標準価格: string // 9桁
  同時入荷区分: string // 0:自動入荷しない
  売単価: string // 10桁
  売価金額: string // 11桁
  規格型番: string // 36文字
  色: string // 7文字
  サイズ: string // 5文字
  計算式コード: string // 2桁
  商品項目１: string // 12桁
  商品項目２: string // 12桁
  商品項目３: string // 12桁
  売上項目１: string // 12桁
  売上項目２: string // 12桁
  売上項目３: string // 12桁
  税率: string // 5桁
  伝票消費税額: string // 11桁
  プロジェクトコード: string // 16桁
  伝票No2: string // 16桁
  データ区分: string // 0:明細
  商品名２: string // 256文字
  単位区分: string // 0:単位区分１
  ロットNo: string // 20桁
  決済会社コード: string // 13桁
  決済会社名: string // 40文字
  決済日: string // YYYYMMDD
  決済手数料: string // 11桁
  手数料外税額: string // 11桁（計算項目）
  手数料内税額: string // 11桁（計算項目）
  手数料税区分: string // 税区分
  手数料税率: string // 5桁
  手数料税込区分: string // 0:税抜
  決済摘要コード: string // 6桁
  決済摘要名: string // 30文字
  売上税種別: string // 0:標準税率
  原価税込区分: string // 0:税抜
  原価税率: string // 5桁
  原価税種別: string // 0:標準税率
  請求先コード: string // 13桁
}

export function convertOrderToPCAFormat(
  order: Order,
  orderDetails: OrderDetail[],
  products: Product[],
): PCAOrderDetailData[] {
  const pcaData: PCAOrderDetailData[] = []

  orderDetails.forEach((detail) => {
    const product = products.find((p) => p.code === detail.product_code)

    const orderDate = new Date(order.order_date).toISOString().slice(0, 10).replace(/-/g, "")
    const requestDate = order.status === "completed" ? orderDate : "0"

    // 税額計算
    const taxAmount = Math.floor(detail.amount * (detail.tax_rate / 100))
    const netAmount = detail.amount - taxAmount

    const pcaRecord: PCAOrderDetailData = {
      伝区: "0", // 掛売
      売上日: orderDate,
      請求日: requestDate,
      伝票No: order.order_no.padStart(8, "0"),
      得意先コード: order.customer_code.padStart(13, "0"),
      得意先名: (order.customer_name || "").substring(0, 40),
      直送先コード: "".padStart(13, "0"),
      直送先名: "",
      先方担当者名: "",
      部門コード: order.department_code.padStart(6, "0"),
      担当者コード: order.staff_code.padStart(13, "0"),
      摘要コード: "".padStart(6, "0"),
      摘要名: "",
      分類コード: "",
      伝票区分: "",
      商品コード: detail.product_code.padStart(13, "0"),
      マスター区分: "0",
      商品名: (detail.product_name || "").substring(0, 36),
      区: "0",
      倉庫コード: "".padStart(6, "0"),
      入数: "0",
      箱数: "0",
      数量: detail.quantity.toString(),
      単位: (product?.unit || "").substring(0, 4),
      単価: detail.unit_price.toString(),
      売上金額: detail.amount.toString(),
      原単価: (product?.cost || 0).toString(),
      原価金額: ((product?.cost || 0) * detail.quantity).toString(),
      粗利益: (detail.amount - (product?.cost || 0) * detail.quantity).toString(),
      外税額: taxAmount.toString(),
      内税額: "0",
      税区分: "2",
      税込区分: "0",
      備考: "",
      標準価格: (product?.price || 0).toString(),
      同時入荷区分: "0",
      売単価: detail.unit_price.toString(),
      売価金額: detail.amount.toString(),
      規格型番: "",
      色: "",
      サイズ: "",
      計算式コード: "0",
      商品項目１: "0",
      商品項目２: "0",
      商品項目３: "0",
      売上項目１: "0",
      売上項目２: "0",
      売上項目３: "0",
      税率: detail.tax_rate.toString(),
      伝票消費税額: taxAmount.toString(),
      プロジェクトコード: "",
      伝票No2: "",
      データ区分: "0",
      商品名２: (detail.product_name || "").substring(0, 256),
      単位区分: "0",
      ロットNo: "",
      決済会社コード: "".padStart(13, "0"),
      決済会社名: "",
      決済日: "0",
      決済手数料: "0",
      手数料外税額: "0",
      手数料内税額: "0",
      手数料税区分: "0",
      手数料税率: "0",
      手数料税込区分: "0",
      決済摘要コード: "".padStart(6, "0"),
      決済摘要名: "",
      売上税種別: "0",
      原価税込区分: "0",
      原価税率: detail.tax_rate.toString(),
      原価税種別: "0",
      請求先コード: order.customer_code.padStart(13, "0"),
    }

    pcaData.push(pcaRecord)
  })

  return pcaData
}

export function generatePCACSV(pcaData: PCAOrderDetailData[]): string {
  const headers = Object.keys(pcaData[0] || {})
  const csvContent = [
    headers.join(","),
    ...pcaData.map((row) => headers.map((header) => `"${row[header as keyof PCAOrderDetailData] || ""}"`).join(",")),
  ].join("\n")

  return csvContent
}
