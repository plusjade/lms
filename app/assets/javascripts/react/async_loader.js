var AsyncLoader = React.createClass({
    displayName: 'AsyncLoader'
    ,
    mixins : [ContentMixin]
    ,
    getDefaultProps: function() {
        return { };
    }
    ,
    // payload must be cleared on mount initialization to ensure loading UI is shown.
    // Note this leverages React Lifecycle behavior: uniquely keyed components only mount once.
    // When fetch() finishes, it triggers an update to the _same_ component.
    // When a differently keyed component (page) is displayed, 
    // the existing page is un-mounted and the new one is mounted.
    componentWillMount : function() {
        this.props.payload = null;
        this.fetch();
    }
    ,
    render : function() {
        var primary;
        if(this.props.payload) {
            primary = this.props.content
                        ? this.props.content(
                            _.extend(
                                { updatePayload: this.updatePayload }
                                , this.props.payload
                            )
                        )
                        : this.props.name
            ;
        }
        else {
            primary = this.wrapContent(StatusMessage.loading());
        }

        return primary;
    }
    ,
    // Asynchronously fetch the payload.
    // This will populate the 'payload' attribute on the parent component.
    fetch : function() {
        if(!this.props.async) { return };

        if(typeof this.props.async === 'function') {
            this.props.async(this.props.handlePayload);
        }
        else {
            var handlePayload = this.props.handlePayload;
            $.ajax({
                url: this.props.async,
                dataType: "JSON"
            })
            .done(function(rsp) {
                handlePayload( _.extend({ status: 'success' }, rsp) )
            })
            .error(function(xhr) {
                handlePayload({
                    status: xhr.status,
                    status: 'error',
                    error: xhr.statusText
                });
            })
        }
    }
    ,
    updatePayload : function(data) {
        this.props.handlePayload(_.extend({}, this.props.payload, data));
    }
});
AsyncLoader = React.createFactory(AsyncLoader);
