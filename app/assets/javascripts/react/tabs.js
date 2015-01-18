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
        tabList.push('students', 'attendances', 'website');

        tabList.forEach(function(key) {
            tabs.push(React.DOM.li(
                        {
                            key: key,
                            className: (this.props.active === key ? 'active' : null)
                            , onClick : this.navigate.bind(this, key)
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
    navigate : function(key) {
        var url = this.props.course.url + '/' + key;
        this.props.router.setRoute(url);
    }
});
Tabs = React.createFactory(Tabs);
