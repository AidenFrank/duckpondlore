import Image from 'next/image';
import Link from 'next/link';
import duckpondLogo from 'public/images/The_Duckpond.png';

export function Header() {
    return (
        <nav className="flex flex-wrap items-center justify-center m-auto p-10 gap-5 bg-gradient-to-b from-lime-200 from-30% via-sky-500">
            <Link href="/" className=''>
                <Image src={duckpondLogo} alt="The Duckpond logo" />
            </Link>
            <div className='bg-discord-dark py-5 px-10 '>
                <h1>The Duckpond</h1>
            </div>
        </nav>
    );
}