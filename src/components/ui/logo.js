import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
  return (
    <Link className="block" href="/">
      <Image
        src="/images/logo_drop_shadow.png"
        alt={'Artistic'}
        height={250}
        width={150}
      />
    </Link>
  );
}
