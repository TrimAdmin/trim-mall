export type UploadCallback = {
  key: string
  hash: string
  imageInfo: ImageInfo
  fname: string
  fsize: number
  type: string
}
export type ImageInfo = {
  colorModel: string
  format: string
  height: number
  size: number
  width: number
}
