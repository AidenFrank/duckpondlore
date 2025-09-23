import { ContentBox } from '../components/contentbox';
import { SideNav } from '../components/sidenav';

export default function Page() {
    return (
        <>
            <div className='flex flex-wrap'>
                <SideNav />
                <ContentBox />
            </div>
        </>
    );
}