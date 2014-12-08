var FeedbackData = React.createClass({
    displayName: 'FeedbackData'
    ,
    mixins: [SortMixin]
    ,
    getDefaultProps: function() {
        return {
            feedbacks: [],
            missing: [],
            feedbacksSortDirection: true
        };
    }
    ,
    render: function() {
        var feedbacks, thead, rows, missing;

        thead = React.DOM.thead(null
                    , React.DOM.tr(null
                        , React.DOM.th({ onClick: this.sort }, 'student_name')
                        , React.DOM.th({ onClick: this.sort }, 'comprehension')
                        , React.DOM.th({ onClick: this.sort }, 'engagement')
                        , React.DOM.th({ onClick: this.sort }, 'pace')
                        , React.DOM.th({ onClick: this.sort }, 'quality')
                    )
                );

        if(this.props.feedbacksSort) {
            feedbacks = this.props.feedbacks.sort(
                                        this.comparator(
                                            this.props.feedbacksSort,
                                            this.props.feedbacksSortDirection
                                        )
                                    );
        }
        else {
            feedbacks = this.props.feedbacks;
        }

        rows = feedbacks.map(function(a, i) {
            return [
                    React.DOM.tr(
                        {
                            key: i,
                            className: 'main'
                        }
                        , React.DOM.td(null, a.student_name)
                        , React.DOM.td(null, a.comprehension)
                        , React.DOM.td(null, a.engagement)
                        , React.DOM.td(null, a.pace)
                        , React.DOM.td(null, a.quality)
                   )
                    , React.DOM.tr({ className: 'essays' }
                        , React.DOM.td({ className: 'name' }, 'comments')
                        , React.DOM.td({ colSpan: 4}
                            , React.DOM.pre(null, a.comments)
                        )
                    )
                    , React.DOM.tr({ className: 'essays' }
                        , React.DOM.td({ className: 'name' }, 'learned')
                        , React.DOM.td({ colSpan: 4}
                            , React.DOM.pre(null, a.learned)
                        )
                    )
                    , React.DOM.tr({ className: 'essays' }
                        , React.DOM.td({ className: 'name' }, 'questions')
                        , React.DOM.td({ colSpan: 4}
                            , React.DOM.pre(null, a.questions)
                        )
                    )
                ];
        }, this);

        if(this.props.missing.length > 0) {
            missing = React.DOM.p(null
                        , this.props.missing.length + ' missing: ' + this.props.missing.join(', ')
                    );
        }

        return React.DOM.div(null
            , React.DOM.p(null
                , (this.props.feedbacks.length + ' of ' + this.props.total_members + ' total. ')
            )
            , missing
            , React.DOM.table({ id: 'feedback-data' }
                    , thead
                    , React.DOM.tbody(null, rows)
            )
        );
    }
    ,
    // Sort rows by a given attribute
    sort : function(event) {
        event.preventDefault();

        this.props.updatePrimaryContent({
            feedbacksSort: event.target.innerHTML,
            feedbacksSortDirection: !this.props.feedbacksSortDirection
        });
    }
});
FeedbackData = React.createFactory(FeedbackData);
