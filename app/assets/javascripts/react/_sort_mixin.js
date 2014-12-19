var SortMixin = {
    // Sort rows by a given attribute
    sortHandler : function(event) {
        event.preventDefault();

        this.props.updatePayload({
            sort: event.target.innerHTML,
            sortDirection: !this.props.sortDirection
        });
    }
    ,
    sortNodes : function(array) {
        if(this.props.sort) {
            return array.sort(this.comparator(this.props.sort, this.props.sortDirection));
        }
        else {
            return array;
        }
    }
    ,
    // return a comparator function based on sorter and direction.
    comparator : function(sorter, direction) {
        // handle string sort
        if(['name', 'student_name'].indexOf(sorter) > -1) {
            if(direction) {
                return function(a, b) {
                    if(a[sorter].toLowerCase() < b[sorter].toLowerCase()) return -1;
                    if(a[sorter].toLowerCase() > b[sorter].toLowerCase()) return 1;
                    return 0;
                }
            }
            else {
                return function(a, b) {
                    if(b[sorter].toLowerCase() < a[sorter].toLowerCase()) return -1;
                    if(b[sorter].toLowerCase() > a[sorter].toLowerCase()) return 1;
                    return 0;
                }
            }
        }
        else {
            if(direction) {
                return function(a, b) {
                    return a[sorter] - b[sorter];
                }
            }
            else {
                return function(a, b) {
                    return b[sorter] - a[sorter];
                }
            }
        }
    }
}
