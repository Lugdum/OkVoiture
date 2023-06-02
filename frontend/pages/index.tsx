import { useEffect, FC } from 'react';
import { useRouter } from 'next/router';

const Home: FC = () => {
    const router = useRouter();

    useEffect(() => {
        router.push('/listings');
    }, [router]);

    return null;
};

export default Home;