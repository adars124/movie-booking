export const setInStorage = (key: string, value: string, remember = false): void => {
    remember ? localStorage.setItem(key, value) : sessionStorage.setItem(key, value);
};

export const getFromStorage = (key: string): string | null => localStorage.getItem(key) || sessionStorage.getItem(key);

export const clearStorage = (key: string): void => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
};

export const setInForm = (event: React.ChangeEvent<any>, state: React.SetStateAction<any>, setState: React.Dispatch<React.SetStateAction<any>>): void => {
    const { name, value } = event.target;

    setState({
        ...state,
        [name]: value,
    });
};
