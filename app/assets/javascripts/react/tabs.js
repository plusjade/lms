var Tabs = React.createClass({
    displayName: 'Tabs'
    ,
    getDefaultProps : function() {
        return {
            tabNames: [],
            course : {},
            user : {}
        }
    }
    ,
    render: function() {
        var tabList = [], tabs = [];

        tabList.push('lessons');
        if(this.props.course.calendar_embed) {
            tabList.push('calendar');
        }
        tabList.push('students', 'attendances', 'websites');

        tabList.forEach(function(key) {
            tabs.push(React.DOM.li(
                        {
                            key: key,
                            className: (this.props.active === key ? 'active' : null)
                            , onClick : this.setActive.bind(this, key)
                        }
                        , this.props.tabNames[key]
                   ));
        }, this);

        return React.DOM.div({ className: 'primary-navigation' }
                    , React.DOM.div({ id: 'heading' }
                        , React.DOM.a({ href: '/' }, this.props.course.name)
                    )
                    , React.DOM.ul({ className: 'nav-tabs' }, tabs)
                )
        ;
    }
    ,
    setActive : function(key) {
        this.props.setActive(key);
    }
});
Tabs = React.createFactory(Tabs);
