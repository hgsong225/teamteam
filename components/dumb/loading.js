import { Spin, Icon } from 'antd';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '500px',
    }
}

const Loading = ({children}) => {
    return (
            <div style={styles.container}>
                <Spin indicator={antIcon} />
            </div>
    );
};

export default Loading;
