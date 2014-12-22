var Lesson = React.createClass({
    displayName: 'Lesson'
    ,
    componentWillMount : function() {
        this.setActive('materials');
    }
    ,
    getDefaultProps: function() {
        return {
            lesson : {}
        };
    }
    ,
    render: function() {
        var head, tabs = [], dict = [];

        head = React.DOM.h3(null
                    , React.DOM.a({
                            href: '/lessons/' + this.props.lesson.id
                        }
                        , 'Lesson ' + this.props.lesson.lesson + ' ' + this.props.lesson.date_human
                    )
        );

        dict = {
            'materials' : {
                key: 'materials',
                name: 'Materials',
                content : function() { return Materials },
                endpoint : function(props) {
                    return '/lessons/' + props.lesson.id + '/materials'
                }
            }
            ,
            'feedback' : {
                key: 'feedback',
                name: 'My Feedback',
                content : function() { return Feedback },
                endpoint : function(props) {
                    return '/students/' + props.user.id + '/lessons/' + props.lesson.id + '/feedback'
                }
            }
            ,
            'feedbacks' : {
                key: 'feedbacks',
                name: 'Feedback Data',
                content : function() { return FeedbackData },
                endpoint : function(props) {
                    return '/lessons/' + props.lesson.id + '/feedbacks'
                }
            }
            ,
            'attendances' : {
                key: 'attendances',
                name: 'Attendance',
                content : function() { return Attendance },
                endpoint : function(props) {
                    return '/lessons/' + props.lesson.id + '/attendances'
                }
            }
        }

        tabs.push('materials');

        switch(this.props.user.type) {
            case 'Student':
                tabs.push('feedback');
                break;
            case 'Teacher':
                tabs.push('feedbacks', 'attendances');
                break;
        };

        return React.DOM.div(null
                        , head
                        , this.renderTabs(tabs, dict)
                );
    }
    ,

    renderTabs: function(_tabs, _dict) {
        var content, tabs = [];

        _tabs.forEach(function(key) {
            var d = _dict[key];
            tabs.push(React.DOM.li(
                        {
                            key: key,
                            className: (this.props.active === key ? 'active' : null),
                            onClick : this.setActive.bind(this, key)
                        }
                        , d.name
                   ));
        }, this);

        if(this.props.response) {
            var active = _dict[this.props.active];
            content = AsyncLoader(_.extend(
                                    active
                                    ,
                                    {
                                        key: active.key + '-sub',
                                        props: this.props,
                                        handleResponse: this.handleNestedResponse,
                                        response: this.props.response,
                                        loading : StatusMessage.loading,
                                        error : StatusMessage.error
                                    }
                                )
                          );
        }

        return React.DOM.div(null
                , React.DOM.ul({ className: 'tabs' }, tabs)
                , React.DOM.div({ className: 'tabs-content' }, content)
            );
    }
    ,
    handleNestedResponse : function(response) {
        this.props.updateResponse({ response : response });
    }
    ,
    updateResponse : function(data) {
        this.props.updateResponse({
            response: _.extend({}, this.props.response, data)
        });
    }
    ,
    // Set viewable Tab
    // @param [String] key - The tab's key
    setActive : function(key) {
        this.props.updateResponse({
            response: {
                status: 'loading'
            },
            active: key
        });
    }
});
Lesson = React.createFactory(Lesson);
