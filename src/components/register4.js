import React, { Component } from 'react';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { faFilm } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import Footer from './footer';
registerPlugin(FilePondPluginImagePreview, FilePondPluginImageResize, FilePondPluginImageCrop, FilePondPluginImageTransform, FilePondPluginImageExifOrientation, FilePondPluginFileEncode, FilePondPluginFileValidateType);

class Register4 extends Component {
    constructor(props) {
        super(props);
        // This binding is necessary to make `this` work in the callback
        this.finishFunction = this.finishFunction.bind(this);
        this.state = {
            LanguageToPractice: [],
            user: {},
            skipOrFinish: "SKIP",
        }
        this.popup = null;
    }

    componentDidMount() {
        this.setState({ user: this.props.location.state.user });
    }

    finishFunction = (event) => {

        event.preventDefault();
        const { user } = this.state;
        console.log(user);
        this.props.history.push('/profile', {});
    }

    render() {
        return (
            <div >
                <div className="wrapper">
                    <div className="background containerR">
                        <div className="para">
                            <h3 className="App1"><FontAwesomeIcon icon={faComment} /> Chat with Natives</h3>
                            <h3 className="App1"><FontAwesomeIcon icon={faFilm} /> Get media suggestions</h3>
                            <h3 className="App1"><FontAwesomeIcon icon={faCheck} /> Get your sentences corrected</h3>
                        </div>
                    </div>


                    <div style={{ marginLeft: "50%", marginTop: "15%" }}>
                        <h3 className="font-weight-bold" style={{ color: "purple", textAlign: "center", marginLeft: "-50%", marginBottom: "20px" }}>Choose your profile picture</h3>
                        <form onSubmit={this.finishFunction} method="POST">
                            <div className="form-row">
                                <div className="form-group col-md-3">
                                    <FilePond allowMultiple={false} name={"file"} labelIdle={`Drag & Drop your picture or <span class="filepond--label-action">Browse</span> `}
                                        imagePreviewHeight='170'
                                        imageCropAspectRatio='1:1'
                                        imageResizeTargetWidth="200"
                                        imageResizeTargetHeight="200"
                                        stylePanelLayout='compact circle'
                                        styleLoadIndicatorPosition='center bottom'
                                        styleButtonRemoveItemPosition='center bottom'
                                        acceptedFileTypes="image/png, image/jpeg" server={{
                                            url: 'http://localhost:3001/login/upload',
                                            process: {
                                                headers: {
                                                    id: this.state.user.id
                                                }, onload: () => {
                                                    this.setState({ skipOrFinish: "FINISH" });
                                                }
                                            }
                                        }} />
                                </div>
                                <div className="form-group col-md-3 mt-5" style={{ color: "purple" }}>
                                    <span className="font-weight-bold ">Username: </span><label > {this.state.user.username}</label>
                                    <span className="font-weight-bold">Country: </span><label >{this.state.user.country}</label>
                                </div>
                            </div>
                            <input className="buttonL font-weight-bold mx-3" type="Submit" value={this.state.skipOrFinish} />
                        </form>
                    </div>
                </div>
                <Footer></Footer>
            </div >

        );
    }
}

export default Register4;