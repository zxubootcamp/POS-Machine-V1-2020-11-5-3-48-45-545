import { loadAllItems, loadPromotions } from './Dependencies'

export function printReceipt(tags: string[]): string {
  const items = loadAllItems()
  const receiptMap = new Map<string, Item>()
  for (const inputTag of tags) {
    const tag: string = inputTag.split('-')[0]
    const quantity = inputTag.split('-').length > 1 ? Number.parseFloat(inputTag.split('-')[1]) : 1
    if (receiptMap.has(tag)) {
      receiptMap.get(tag)!.quantity += quantity
    }
    else {
      const item = items.find(item => item.barcode === tag)!
      receiptMap.set(tag, new Item(item.barcode, item.name, item.unit, item.price))
      receiptMap.get(tag)!.quantity = quantity
    }
  }
  const promotion = new Promotion(loadPromotions()[0]!.type, loadPromotions()[0]!.barcodes)

  const receiptArray = Array.from(receiptMap)

  return '***<store earning no money>Receipt ***\n' +
    `${receiptArray.map(item => item[1].toOutput() + `Subtotal：${promotion.calculateSubtotal(item[1]).toFixed(2)}(yuan)\n`).reduce((x, y) => x + y)}` +
    '----------------------\n' +
    `Total：${receiptArray.map(item => promotion.calculateSubtotal(item[1])).reduce((x, y) => x + y).toFixed(2)}(yuan)\n` +
    `Discounted prices：${(receiptArray.map(item => item[1].price * item[1].quantity).reduce((x, y) => x + y) - receiptArray.map(item => promotion.calculateSubtotal(item[1])).reduce((x, y) => x + y)).toFixed(2)}(yuan)\n` +
    '**********************'

  //   return `***<store earning no money>Receipt ***
  // Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
  // Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
  // Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
  // ----------------------
  // Total：58.50(yuan)
  // Discounted prices：7.50(yuan)
  // **********************`
}

export class Item {
  barcode: string
  name: string
  unit: string
  price: number
  quantity: number

  constructor(barcode: string, name: string, unit: string, price: number) {
    this.barcode = barcode
    this.name = name
    this.unit = unit
    this.price = price
    this.quantity = 1
  }

  toOutput(): string {
    let unitString = ''
    if (this.quantity > 1) {
      unitString = ' ' + this.unit + 's'
    }
    const outString = `Name：${this.name}，Quantity：${this.quantity + unitString}，Unit：${this.price.toFixed(2)}(yuan)，`
    return outString
  }
}

export class Promotion {
  type: string
  barcodes: string[]
  constructor(type: string, barcodes: string[]) {
    this.type = type
    this.barcodes = barcodes
  }

  calculateSubtotal(item: Item): number {
    console.log(item)
    if (this.barcodes.find(barcode => barcode === item.barcode) !== null) {
      const promotionTimes = Math.floor(item.quantity / 3)
      return item.price * 2 * promotionTimes + item.price * (item.quantity % 3)
    }
    else {
      return item.price * item.quantity
    }
  }
}
