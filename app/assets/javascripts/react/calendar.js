var Calendar = React.createClass({
    displayName: 'Calendar'
    ,
    mixins : [ContentMixin]
    ,
    getDefaultProps: function() {
        return {};
    }
    ,
    render: function() {
        var primary;
        primary = React.DOM.div(null
            , React.DOM.iframe({
                    src: this.props.course.calendar_embed,
                    frameBorder: 0,
                    scrolling: 'no',
                    seamless: true,
                    width: '100%',
                    height: 600
                }
            )
        );

        return this.wrapContent(primary);
    }
});
Calendar = React.createFactory(Calendar);
