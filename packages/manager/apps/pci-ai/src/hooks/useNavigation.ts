import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { useEffect, useState } from 'react';

export function useNavigate (
    univer: string,
    url: string,
    param: {}
) {
    const navigation = useNavigation();
    const [goUrl, setGoUrl] = useState("")
    useEffect(() => {
        const fetchUrl = async () => {
            const goTo = (await navigation.getURL(univer, url, param)) as string;
            setGoUrl(goTo);
        }
        fetchUrl();
    }, [navigation])
    return goUrl;
};
