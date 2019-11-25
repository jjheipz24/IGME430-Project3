"use strict";

//handles requests on the image upload form after submit clicked
//shows error messages depending on the error
var handleImg = function handleImg(e) {
    e.preventDefault();

    $(".error").fadeOut(400);

    if ($("#userImg").val() == '') {
        showError("Please select an image");
        return false;
    }

    fileUpload($("#imgUploadForm").attr("action"), new FormData($("#imgUploadForm")[0]));

    return false;
};

var Header = function Header() {
    return React.createElement(
        "div",
        { className: "row justify-content-center" },
        React.createElement(
            "div",
            { className: "col-10" },
            React.createElement(
                "header",
                null,
                React.createElement(
                    "h1",
                    { id: "title" },
                    React.createElement(
                        "a",
                        { href: "/" },
                        "SHMOOD"
                    )
                ),
                React.createElement(
                    "p",
                    null,
                    "create your own personalized mood board"
                )
            )
        ),
        React.createElement("div", { className: "col-1" })
    );
};

var ImageGrid = function ImageGrid(props) {
    console.dir(props.imgs);
    if (props.imgs.length === 0) {
        return React.createElement(
            "div",
            { className: "col-10", id: "grid" },
            React.createElement(
                "h2",
                { id: "noImg" },
                "No images have been uploaded"
            )
        );
    }

    var col1 = props.imgs[0].map(function (img) {
        return React.createElement("img", { src: img, className: "img-fluid mb-4" });
    });

    var col2 = props.imgs[1].map(function (img) {
        return React.createElement("img", { src: img, className: "img-fluid mb-4" });
    });

    var col3 = props.imgs[2].map(function (img) {
        return React.createElement("img", { src: img, className: "img-fluid mb-4" });
    });

    return React.createElement(
        "div",
        { className: "col-10", id: "grid" },
        React.createElement(
            "div",
            { className: "row" },
            React.createElement(
                "div",
                { className: "col" },
                col1
            ),
            React.createElement(
                "div",
                { className: "col" },
                col2
            ),
            React.createElement(
                "div",
                { className: "col" },
                col3
            )
        )
    );
};

var SideBar = function SideBar(props) {
    if (props.username === "" || !props.username) {
        return React.createElement(
            "div",
            { className: "position-fixed btn-group-vertical" },
            React.createElement(
                "button",
                null,
                React.createElement(
                    "a",
                    { href: "/signup" },
                    "signup"
                )
            ),
            React.createElement(
                "button",
                null,
                React.createElement(
                    "a",
                    { href: "/login" },
                    "login"
                )
            )
        );
    }

    return React.createElement(
        "div",
        { className: "position-fixed btn-group-vertical" },
        React.createElement(
            "button",
            null,
            React.createElement(
                "a",
                { href: "/userPage" },
                props.username
            )
        ),
        React.createElement(
            "button",
            null,
            React.createElement(
                "a",
                { href: "/logout" },
                "logout"
            )
        )
    );
};

var loadImages = function loadImages() {
    sendGenericAjax('GET', '/getHomeImg', null, function (data) {
        ReactDOM.render(React.createElement(ImageGrid, { imgs: data.imgs }), document.querySelector("#grid"));
    });
};

var loadUsername = function loadUsername() {
    debugger;
    sendGenericAjax('GET', '/getUsername', null, function (data) {
        debugger;
        ReactDOM.render(React.createElement(SideBar, { username: data.username }), document.querySelector("#sidebar"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(Header, null), document.querySelector("#header"));

    ReactDOM.render(React.createElement(ImageGrid, { imgs: [] }), document.querySelector("#grid"));

    ReactDOM.render(React.createElement(SideBar, { username: "" }), document.querySelector("#sidebar"));

    loadImages();
    loadUsername();
};

var getToken = function getToken() {
    sendGenericAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});