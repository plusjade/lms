var Lessons = React.createClass({
    displayName: 'Lessons'
    ,
    mixins : [ContentMixin]
    ,
    getDefaultProps: function() {
        return { lessons: [], navOpen: true };
    }
    ,
    render: function() {
        var navigation, primary, nodes, lessonView, head;

        if(this.props.lesson) {
            head = React.DOM.h3(null
                        , 'Lesson ' + this.props.lesson.lesson + ' ' + this.props.lesson.date_human
                        , React.DOM.svg({
                                viewBox: '5.0 -10.0 100 120',
                                onClick : this.toggle
                            }
                            , React.DOM.polygon({
                                points: '53.75,10 93.375,50 53,90 53,70 73.75,50 53.875,30'
                            })
                            , React.DOM.polygon({
                                points: '18.75,10 58.375,50 18,90 18,70 38.75,50 18.875,30'
                            })
                        )
            );

            lessonView = Lesson(
                                _.extend({
                                    _key : this.props.lesson.id,
                                    updatePrimaryContent: this.updatePrimaryContent
                                }, this.props)
                        );
        }

        primary = React.DOM.div({
                    id: 'lesson-wrap',
                }
                , head
                , lessonView
        );

        nodes = this.props.lessons.map(function(a, i) {
            var classes;
            if(this.props.lesson && a.id === this.props.lesson.id) {
                classes = 'active';
            }
            return React.DOM.li({
                        key: a.id,
                        className: classes
                        , onClick: this.loadLesson.bind(this, i)
                    }
                    , React.DOM.span(null, a.lesson + ' - ')
                    , a.date_human
                )
        }, this);

        navigation = React.DOM.ul(null, nodes);

        return this.wrapContent(primary, navigation);
    }
    ,
    loadLesson: function(index) {
        if(this.props.lessons[index]) {
            this.updatePrimaryContent({
                lesson : this.props.lessons[index]
            });
        }
    }
    ,
    toggle : function() {
        this.updatePrimaryContent({ navOpen: !this.props.navOpen });
    }
    ,
    updatePrimaryContent : function(data) {
        MK.Nav.setState({ content : _.extend({}, this.props, data) });
    }
});
Lessons = React.createFactory(Lessons);
