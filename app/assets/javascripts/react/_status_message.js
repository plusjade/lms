var StatusMessage = {
    loading : function() {
        if (Modernizr.cssanimations) {
            return React.DOM.div({ className: 'spinner' }
                , React.DOM.div({ className: 'rect1' })
                , React.DOM.div({ className: 'rect2' })
                , React.DOM.div({ className: 'rect3' })
                , React.DOM.div({ className: 'rect4' })
                , React.DOM.div({ className: 'rect5' })
            );
        }
        else {
            return React.DOM.div({ className : 'loading-basic' }
                , 'Loading ...'
            )
        }
    }
    ,
    error : function(props) {
        return React.DOM.div({ className : 'error-message' }
                , 'Oops! There was an error. Please try again and refresh the page. '
                , React.DOM.span(null, ('(' + props.status + ' ' + props.error + ')'))
            )
    }
}
