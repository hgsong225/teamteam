import React, { Component } from 'react';

import ProfileComp from '../../components/smart/profile/Profile';
import MainView from '../../components/layout/MainView';

import '../../style/profile.css';

class Profile extends Component {
    render() {
        return (
            <MainView>
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
