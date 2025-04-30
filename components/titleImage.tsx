import Image from 'next/image'

export default function TitleImage() {
  return (
    <div className="title-image">
      <Image src="/codenameslogo.png" alt="Codenames Logo" width={300} height={80} />
    </div>
  )
}
