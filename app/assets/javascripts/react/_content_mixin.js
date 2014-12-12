var ContentMixin = {
    wrapContent : function(primary, navigation) {
        return React.DOM.div({ className: this.props.navOpen ? 'nav-open' : null }
                , React.DOM.div({ className: 'navigation' }
                    , navigation
                )
                , React.DOM.div({ className: 'primary-content' }
                    , React.DOM.div({ className: 'inner ' }
                        , primary
                    )
                )
            );
    }
}
