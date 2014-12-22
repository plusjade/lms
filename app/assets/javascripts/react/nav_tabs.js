var NavTabs = React.createClass({
    displayName: 'NavTabs'
    ,
    mixins : [ContentMixin]
    ,
    propTypes : {
        course : React.PropTypes.object.isRequired,
        user : React.PropTypes.object.isRequired,
        CSRFTOKEN : React.PropTypes.string.isRequired
    }
    ,
    getDefaultProps : function() {
        return {
            course : {},
            user : {},
            dict : {
                'lessons' : {
                    key: 'lessons',
                    name: 'Lessons',
                    content: Lessons,
                    async : function(update, props) {
                        update({
                            status: 'success',
                            lessons: props.course.lessons,
                            lesson: props.lesson || props.course.lessons[0]
                        });
                    }
                }
                ,
                'calendar' : {
                    key: 'calendar',
                    name: 'Calendar',
                    content: Calendar,
                    async: function(update, props) {
                        update({
                            status: 'success',
                            embed_url: props.course.calendar_embed
                        });
                    }
                }
                ,
                'students' : {
                    key: 'students',
                    name: 'Members',
                    content: Members,
                    endpoint: function(props) {
                        return '/courses/' + props.course.id + '/students'
                    }
                }
                ,
                'attendances' : {
                    key: 'attendances',
                    name: 'Attendance',
                    content: Attendances,
                    endpoint: function(props) {
                        return '/courses/' + props.course.id + '/attendances'
                    }
                }
                ,
                'websites' : {
                    key:'websites',
                    name: 'My Website',
                    content: function() { return Website },
                    async: function(update, props) {
                        update({
                            status: 'success',
                            user: props.user
                        });
                    }
                }
            }
        }
    }
    ,
    getInitialState: function() {
        return { active : null };
    }
    ,
    render: function() {
        var tabList = [], tabs = [], active, primary, wrapContent, props;

        tabList.push('lessons');
        if(this.props.course.calendar_embed) {
            tabList.push('calendar');
        }
        tabList.push('students', 'attendances', 'websites');

        tabList.forEach(function(key) {
            tabs.push(React.DOM.li(
                        {
                            key: key,
                            className: (this.state.active === key ? 'active' : null),
                            onClick : this.setActive.bind(this, key)
                        }
                        , this.props.dict[key].name
                   ));
        }, this);

        if(tabList.length > 0 && this.state.active) {
            active = this.props.dict[this.state.active];
            wrapContent = this.wrapContent;
            props = _.extend({ updateResponse : this.updateResponse }, this.props);
            delete props.dict;

            primary = AsyncLoader(_.extend(
                                    active
                                    ,
                                    {
                                        key: active.key,
                                        props : props,
                                        handleResponse: this.handleResponse,
                                        response: this.state.response,
                                        loading : function() {
                                            return wrapContent(StatusMessage.loading());
                                        },
                                        error : function(response) {
                                            return wrapContent(StatusMessage.error(response));
                                        }
                                    }
                                )
                          );
        }

        return React.DOM.div(null
                , React.DOM.div({ className: 'primary-navigation' }
                    , React.DOM.div({ id: 'heading' }
                        , React.DOM.a({ href: '/' }, this.props.course.name)
                    )
                    , React.DOM.ul({ className: 'nav-tabs' }, tabs)
                )
                , primary
            );
    }
    ,
    handleResponse : function(response) {
        this.setState({
            response: response
        });
    }
    ,
    updateResponse : function(data) {
        this.setState({
            response: _.extend({}, this.state.response, data)
        });
    }
    ,
    // Set active tab
    // @param [String] key - The tab's key
    setActive : function(key) {
        this.setState({ active : key, response: null });
    }
});
NavTabs = React.createFactory(NavTabs);
