var Calendar = React.createClass({
    displayName: 'Calendar'
    ,
    getDefaultProps: function() {
        return {};
    }
    ,
    render: function() {
        console.log(this.props)
        return React.DOM.div(null
            , React.DOM.iframe({
                    src: MK.COURSE.calendar_embed,
                    frameBorder: 0,
                    scrolling: 'no',
                    seamless: true,
                    width: '100%',
                    height: 600
                }
            )
        );
    }
});
Calendar = React.createFactory(Calendar);
