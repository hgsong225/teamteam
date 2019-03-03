import Meta from './Meta'

const View = ({children}) => {
    return (
        <div>
            <style jsx>{`
                .main-container2 {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                    min-height: 105vh;
                }
            `}</style>
            <div className="main-container2">
                <Meta />
                {children}
            </div>
        </div>
    );
};

export default View;
