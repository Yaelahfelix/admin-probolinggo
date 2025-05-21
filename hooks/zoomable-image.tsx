
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DetailedHTMLProps, ImgHTMLAttributes } from 'react'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export default function ZoomableImage({
  src,
  alt,
  className,
}: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) {
  if (!src) return null
  return (
    <Dialog>

      <DialogTrigger asChild>
        <Image
          src={src}
          alt={alt || ''}
          sizes="100vw"
          className={className}
          style={{
            width: '100%',
            height: 'auto',
          }}
          width={500}
          height={100}
        />
      </DialogTrigger>
      <DialogContent className="flex flex-col sm:max-w-[425px] p-3 gap-3">
        <DialogHeader className='flex p-10'>
          <DialogTitle className='flex p-10'>Foto Aduan</DialogTitle>
        </DialogHeader>
        <div className="h-[500px] w-full overflow-clip rounded-md bg-slate-300 shadow-md">
          <Image
              src={src}
              alt={alt || ''}
              style={{
                width: '100%',
                height: 'auto',
              }}
              width={700}
              height={100}
              className='h-full w-full object-contain'
            />

        </div>
      </DialogContent>
    </Dialog>
  )
}
