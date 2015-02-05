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
                        , React.DOM.th({ onClick: this.sort, 'data-ot': this.toolTipTextForHeader('comprehension') }, 'comprehension')
                        , React.DOM.th({ onClick: this.sort, 'data-ot': this.toolTipTextForHeader('engagement') }, 'engagement')
                        , React.DOM.th({ onClick: this.sort, 'data-ot': this.toolTipTextForHeader('pace') }, 'pace')
                        , React.DOM.th({ onClick: this.sort, 'data-ot': this.toolTipTextForHeader('quality') }, 'quality')
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
                        , React.DOM.td({ className: 'user' }
                            , (a.student.avatar ? React.DOM.img({src: a.student.avatar }) : null)
                            , React.DOM.div(null, a.student.name)
                        )
                        , React.DOM.td({ className: 'data' }
                            , React.DOM.div({ className: 'scale-' + a.comprehension, 'data-ot': this.toolTipTextFor('comprehension', a.comprehension) }, a.comprehension)
                        )
                        , React.DOM.td({ className: 'data' }
                            , React.DOM.div({ className: 'scale-' + a.engagement, 'data-ot': this.toolTipTextFor('engagement', a.engagement) }, a.engagement)
                        )
                        , React.DOM.td({ className: 'data' }
                            , React.DOM.div({ className: 'scale-pace-' + a.pace, 'data-ot': this.toolTipTextFor('pace', a.pace) }, a.pace)
                        )
                        , React.DOM.td({ className: 'data' }
                            , React.DOM.div({ className: 'scale-' + a.quality, 'data-ot': this.toolTipTextFor('quality', a.quality) }, a.quality)
                        )
                    )
                    , React.DOM.tr({ className: 'essays' }
                        , React.DOM.td({ colSpan: 5 }
                            , this.renderTextResponse(a, 'comments')
                            , this.renderTextResponse(a, 'learned')
                            , this.renderTextResponse(a, 'questions')
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
    renderTextResponse : function(data, name) {
        if(data[name] === '') {
            return null;
        }
        else {
            return React.DOM.div(null
                    , React.DOM.strong(null, name)
                    , React.DOM.pre(null, data[name])
            )
        }
    }
    ,
    // Sort rows by a given attribute
    sort : function(event) {
        event.preventDefault();

        this.props.updateResponse({
            feedbacksSort: event.target.innerHTML,
            feedbacksSortDirection: !this.props.feedbacksSortDirection
        });
    },

    componentDidMount: function() {
        Opentip.findElements();
    },

    toolTipTextFor : function(category, score) {
        var questionData = this.questionDataForCategory(category);
        return questionData['data'][score-1];
    },

    toolTipTextForHeader: function(category) {
        var questionData = this.questionDataForCategory(category);
        return questionData['question'];
    },

    questionDataForCategory: function(category) {
        var questions = Feedback()._store.props.questions;
        var questionData = _.find(questions, function (question) {
            return question['name'] == category;
        });
        return questionData;
    }
});
FeedbackData = React.createFactory(FeedbackData);
