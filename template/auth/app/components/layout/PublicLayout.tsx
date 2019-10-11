import React, { useRef } from 'react';
import { Icons, MainAreaContext } from 'react-components';

interface Props {
    children: React.ReactNode;
}

const PublicLayout = ({ children }: Props) => {
    const mainAreaRef = useRef();

    return (
        <>
            <div className="flex flex-nowrap">
                <main ref={mainAreaRef} className="main flex-item-fluid main-area">
                    <MainAreaContext.Provider value={mainAreaRef}>{children}</MainAreaContext.Provider>
                </main>
            </div>
            <Icons />
        </>
    );
};

export default PublicLayout;
