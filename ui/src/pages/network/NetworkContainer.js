import { connect } from 'react-redux'

import Network from './Network';

const mapStateToProps = state => ({
	withUser: state.network.withUser,
	currentUser: state.user.data,
	receiver: state.network.receiver
});

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Network);
