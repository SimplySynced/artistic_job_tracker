import Link from 'next/link';
import Image from 'next/image';
import artistic_logo from '@/public/images/logo_drop_shadow.png'

export default function Logo() {
  return (
    <Link className="block" href="/">
      <Image
        src={ artistic_logo }
        alt={'Artistic'}
        height={250}
        width={150} />
    </Link>
  )
}
