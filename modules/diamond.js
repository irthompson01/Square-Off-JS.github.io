export class Diamond {
  constructor(top, left, bottom, right){
    this.top = top;
    this.left = left;
    this.bottom = bottom;
    this.right = right;

    this.top_x = top.origin_x + (top.length / 2);
    this.top_y = top.origin_y + (top.length / 2);
    this.left_x = left.origin_x + (left.length / 2);
    this.left_y = left.origin_y + (left.length / 2);
    this.bottom_x = bottom.origin_x + (bottom.length / 2);
    this.bottom_y = bottom.origin_y + (bottom.length / 2);
    this.right_x = right.origin_x + (right.length / 2);
    this.right_y = right.origin_y + (right.length / 2);

    this.size = ((top.origin_x - left.origin_x) / top.length) + 1;
    this.points = this.size*this.size*2;
    this.newBox = true;
  }

  checkOwnership(){
    if (this.top.occupant == this.left.occupant &&
        this.left.occupant == this.bottom.occupant &&
        this.bottom.occupant == this.right.occupant &&
        this.right.occupant != -1){

        if (this.newBox == true){
            this.new_box = false;
            return true;
          };
        }

    else{
        return false;
      }
  };
}
