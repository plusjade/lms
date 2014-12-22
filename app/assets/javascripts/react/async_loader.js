var AsyncLoader = React.createClass({
    displayName: 'AsyncLoader'
    ,
    propTypes : {
        content : React.PropTypes.func.isRequired
        ,
        async : React.PropTypes.oneOfType([
                    React.PropTypes.string.isRequired,
                    React.PropTypes.func.isRequired
                ])
        ,
        handleResponse : React.PropTypes.func.isRequired
        ,
        loading : React.PropTypes.func.isRequired
        ,
        error : React.PropTypes.func.isRequired
        ,
        wrapContent : React.PropTypes.func
        ,
        response : React.PropTypes.object
    }
    ,
    // response must be cleared on mount initialization to ensure loading UI is shown.
    // Note this leverages React Lifecycle behavior: uniquely keyed components only mount once.
    // When fetch() finishes, it triggers an update to the _same_ component.
    // When a differently keyed component (page) is displayed, 
    // the existing page is un-mounted and the new one is mounted.
    componentWillMount : function() {
        this.props.response = null;
        this.fetch();
    }
    ,
    componentWillReceiveProps : function(nextProps) {
        if(!nextProps.response) {
            this.fetch();
        }
    }
    ,
    render : function() {
        var primary, status, response;
        status = this.props.response ? this.props.response.status : 'loading';
        response = this.props.props ?
                        _.extend({}, this.props.props, this.props.response)
                        : this.props.response
        ;
        switch (status) {
            case 'success':
                primary = this.props.content(response);
                // Hack to determine distinguish valid React components.
                // Consider removing later.
                var test = this.props.content();
                if(test._isReactElement) {
                    primary = this.props.content(response);
                }
                else {
                    // assume the content is a function that returns a react element.
                    primary = this.props.content()(response);
                }
                break;

            case 'error':
                primary = this.props.error(response);
                break;

            default: // loading
                primary = this.props.loading(response);
        }

        return this.props.wrapContent ? this.props.wrapContent(primary) : primary;
    }
    ,
    // Asynchronously fetch the response.
    // This will populate the 'response' attribute on the parent component.
    fetch : function() {
        if(typeof this.props.async === 'function') {
            this.props.async(this.props.handleResponse, this.props.props);
        }
        else if(this.props.endpoint) {
            var endpoint = typeof this.props.endpoint === 'function'
                                ? this.props.endpoint(this.props.props)
                                : this.props.endpoint

            var handleResponse = this.props.handleResponse;
            $.ajax({
                url: endpoint,
                dataType: "JSON"
            })
            .done(function(rsp) {
                handleResponse(_.extend({ status: 'success' }, rsp));
            })
            .error(function(xhr) {
                handleResponse({
                    status: xhr.status,
                    status: 'error',
                    error: xhr.statusText
                });
            })
        }
    }
});
AsyncLoader = React.createFactory(AsyncLoader);
