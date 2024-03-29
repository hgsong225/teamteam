import Meta from './Meta'

const View = ({children}) => {
    return (
            <div className="main-container">
                <style jsx>{`
                    .main-container {
                        display: flex;
                        flex-direction: column;
                        width: 100%;
                        min-height: 100%;
                    }
                `}</style>
                <Meta />
                {children}
            </div>
    );
};

export default View;
