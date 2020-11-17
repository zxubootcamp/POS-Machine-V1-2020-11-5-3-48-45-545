import { loadAllItems, loadPromotions } from './Dependencies'

export function printReceipt(tags: string[]): string {
  const items = loadAllItems()
  const receiptMap = new Map()
  for (const inputTag of tags) {
    const tag = inputTag.split('-')[0]
    const quantity = inputTag.split('-').length > 1 ? Number.parseFloat(inputTag.split('-')[1]) : 1
    if (receiptMap.has(tag)) {
      receiptMap.get(tag).quantity += quantity
    }
    else {
      const item = items.find(item => item.barcode === tag)
      receiptMap.set(tag, { ...item, quantity: quantity } as Item)
    }
  }
  console.log(...receiptMap)
  const promotion = loadPromotions()[0] as Promotion




  return `***<store earning no money>Receipt ***
Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
----------------------
Total：58.50(yuan)
Discounted prices：7.50(yuan)
**********************`
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

  public toOutput() {
    let unitString = ''
    if (this.quantity > 1) {
      unitString = ' ' + this.unit + 's'
    }
    const outString = `Name: ${this.name}, Quantity: ${this.quantity + unitString}, Unit price: ${this.price.toFixed(2)} (yuan), Subtotal: ${(this.price * this.quantity).toFixed(2)} (yuan)\n`
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
}
