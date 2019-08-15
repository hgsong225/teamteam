import React, { Component } from 'react';
import Head from 'next/head';

import ProfileComp from '../../components/smart/profile/Profile';
import MainView from '../../components/layout/MainView';

class Profile extends Component {
    render() {
        return (
            <MainView>
                <Head>
                    <title>팀팀 - 프로필</title>
                    <link href="../../static/profile.css" rel="stylesheet" />
                </Head>
                <ProfileComp />
            </MainView>
        )
    }

}
// const Profile = () => (
//     <div>
//         <ProfileComp />
//     </div>
// );

export default Profile;
