//Directive will add listeners to the status bins
app.directive('boxListeners', function(dragHelper){
  return {
    replace: false,
    restrict: 'AE',
    scope: {},
    link: function(scope, element, attr){

      //Callback to handle dragenter event on target status bin
      var dragenterHandler = function(e){
        var targetStatusOrder = this.getAttribute('statusOrder');
        var sourceStatusOrder = dragHelper.element.getAttribute('statusOrder');

        if (!sourceStatusOrder || sourceStatusOrder*1 < targetStatusOrder*1){
          this.classList.add('dr-over-valid');
        } else {
          this.classList.add('dr-over-invalid');
        }

        return false;
      };

      //Callback to handle dragover event on target status bin
      var dragoverHandler = function(e){
        if(e.preventDefault) {
          e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
      };

      //Callback to handle dragleave event on target status bin
      var dragleaveHandler = function(e){
        this.classList.remove('dr-over-valid');
        this.classList.remove('dr-over-invalid');
        console.log(this);
        return false;
      };

      //Callback to handle drop event on target status bin
      var dragdropHandler = function(e){
        var targetStatusOrder = this.getAttribute('statusOrder');
        var sourceStatusOrder = e.dataTransfer.getData('sourceStatusOrder');
        console.log(this);

        this.classList.remove('dr-over-valid');
        this.classList.remove('dr-over-invalid');

        if (!sourceStatusOrder || sourceStatusOrder*1 < targetStatusOrder*1){
          if (e.stopPropagation) {
            // stops the browser from redirecting.
            e.stopPropagation();
          }
          //Specify what type of drags are allowed. Must match the drop handler
          e.dataTransfer.dropEffect = 'move';

          //Invoke callback function on successful drop and send in source, company, and target data
          dragHelper.dropHandler
          ({
            origin:
              {
                id  : e.dataTransfer.getData('sourceStatusId'),
                name: e.dataTransfer.getData('sourceStatusName')
              },
            company:
              {
                id  : e.dataTransfer.getData('companyId'),
                name: e.dataTransfer.getData('companyName')
              },
            dest:
              {
                id  : this.getAttribute('statusId'),
                name: this.getAttribute('statusName')
              }
          });

          //update the statusId and statusName attributes on the company object to reflect the new bin
          dragHelper.element.setAttribute('statusId', this.getAttribute('statusId'));
          dragHelper.element.setAttribute('statusName', this.getAttribute('statusName'));
          dragHelper.element.setAttribute('statusOrder', this.getAttribute('statusOrder'));

          //Append the object being moved to the target status bin
          this.appendChild(dragHelper.element);
          this.classList.remove('dr-over');
        }
        return false;
      };

      //Add event listeners and callbacks to the element
      var el = element[0];
      el.addEventListener('dragover', dragoverHandler);
      el.addEventListener('dragenter', dragenterHandler);
      el.addEventListener('dragleave', dragleaveHandler);
      el.addEventListener('drop', dragdropHandler);
    }
  };
});

//Directive will add listeners to the draggable company objects
app.directive('draggableItem', function(dragHelper){
  return {
    replace: true,
    restrict: 'AE',
    scope: {},
    link: function(scope, element, attr){

      //Callback to handle the dragstart event on the company object
      var dragstartHandler = function(e){

        //Save a reference to the element to a property in dragHelper
        dragHelper.element = this;

        //Add data about this object to the dataTransfer object
        e.dataTransfer.setData('companyId', this.getAttribute('companyId'));
        e.dataTransfer.setData('companyName', this.getAttribute('companyName'));
        e.dataTransfer.setData('sourceStatusId', this.getAttribute('statusId'));
        e.dataTransfer.setData('sourceStatusName', this.getAttribute('statusName'));
        e.dataTransfer.setData('sourceStatusOrder', this.getAttribute('statusOrder'));
        this.classList.add('dr-drag');

        return false;
      };

      //Callback to handle the dragend event
      var dragendHandler = function(e){
        this.classList.remove('dr-drag');
        return false;
      };

      //Enable dragging and add event listeners/callbacks
      var el = element[0];
      el.draggable = true;
      el.addEventListener('dragstart', dragstartHandler);
      el.addEventListener('dragend', dragendHandler);
    }
  };
});