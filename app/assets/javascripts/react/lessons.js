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
        var navigation, primary, nodes, toggler, lessonView;

        toggler = React.DOM.svg({
                        className: 'navToggler',
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
        ;

        if(this.props.lesson) {
            lessonView = Lesson(_.extend({
                                    key : this.props.lesson.id
                                }, this.props) // this.props is the parent's async response
                        );
        }

        primary = React.DOM.div({
                    id: 'lesson-wrap',
                }
                , toggler
                , lessonView
        );

        nodes = this.props.lessons.map(function(a, i) {
            var classes, active;
            if(this.props.lesson && a.id === this.props.lesson.id) {
                classes = 'active';
                active = React.DOM.svg({ viewBox: '5.0 -10.0 90 125' }
                          , React.DOM.path({ d: 'M79.674,53.719c2.59-2.046,2.59-5.392,0-7.437L22.566,1.053C19.977-0.993,18,0.035,18,3.335v93.331    c0,3.3,1.977,4.326,4.566,2.281L79.674,53.719z' })
                );
            }

            return React.DOM.li({
                        key: a.id,
                        className: classes
                        , onClick: this.loadLesson.bind(this, i)
                    }
                    , active
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
            this.props.router.setRoute(this.props.lessons[index].url);
        }
    }
    ,
    toggle : function() {
        this.props.updateResponse({ navOpen: !this.props.navOpen });
    }
});
Lessons = React.createFactory(Lessons);
