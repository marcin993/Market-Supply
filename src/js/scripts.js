/*!
Site scripts
*/

(function($){
  $(document).ready(function() {

    $(".nav-btn").on("click", function() {
        $(".top-content").slideToggle("slow");
    });

    $(".categories-btn").on("click", function() {
        $(".categories-menu").slideToggle("slow");
    });

    $(".category-menu > li").on("click", function(e) {
        var target = $(e.target);

        if(e.target.parentElement.classList.contains("category-menu")) {
            target.toggleClass("open");
            target.find(".subcategory-menu").slideToggle("slow");
        }
    });

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function Rating(elem) {
        var counter = 0,
            stars = $(elem).find("i"),
            inputs = $(elem).next().find("input");

        stars.hover(function(e) {
            $(this).prevAll().addBack().addClass("fa-star-hover");
        },
        function() {
            $(this).prevAll().addBack().removeClass("fa-star-hover");
        });

        stars.on("click", function(e) {
            if(counter < 1) {
                var index = $(this).index();

                $(this).siblings().removeClass("fa-star");
                $(this).siblings().addClass("fa-star-o");
                $(this).prevAll().addBack().removeClass("fa-star-o").addClass("fa-star");

                inputs.eq(index).prop("checked", true);
                counter++;
            }
        });
    }

    $(".rating").each(function(i, elem) {
        new Rating($(elem));
    })


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function PanelControl(boxId, filter) {
        this.prevBtn = $(boxId + " button").eq(0);
        this.nextBtn = $(boxId + " button").eq(1);
        this.box = $(boxId + " .panel-content");

        this.navElems = $(boxId + " .filter-category-menu li");
        this.products = $(boxId + " .product");

        this.slideProduct("init");

        if(filter == true) {
            this.productsFilter();
        }
    }

    PanelControl.prototype.slideProduct = function(start) {
        var width = $(window).width(),
            limit = 0,
            offset = 0,
            largePanel = this.box.parent().hasClass("panel-lg"),
            blankCell = 0;

        //Definicja przesunięcia po naciśnięciu przycisku. this.offset = szerokość diva z produktem. Główny warunki dla dużego panelu, blok else - dla małego
        if(largePanel) {
            if(width >= 1180) {
                this.offset = 25;
                blankCell = 3;
            }
            else if (width >=  650) {
                this.offset = 33;
                blankCell = 2;
            }
            else if (width < 650) {
                this.offset = 100;
            }
        } else {
            this.offset = 100;
        }

        //Jeśli funkcja zostanie wywołana z parametrem start ustawionym na wartość init do nawigacji zostaną podpiętę wszytskie divy z klasą produkt. W przeciwnym wypadku zostaną wyszukane tylko wyfiltrowane
        if(start == "init") {
            limit = parseInt((this.products.length - blankCell) * -this.offset);
        } else {
            this.productsEdited = this.box.find(".product[style='display: block;']");
            this.box.css("transform", "translateX(0%)")
            limit = parseInt((this.productsEdited.length - blankCell) * -this.offset);
        }

        //Proste operacje przesuwania diva
        this.nextBtn.on("click", function() {
            offset -= this.offset;
            if(offset > limit) {
                this.box.css("transform", "translateX(" + offset + "%)")
            } else {
                offset = 0;
                this.box.css("transform", "translateX(" + offset + "%)")
            }
        }.bind(this));

        this.prevBtn.on("click", function() {
            offset += this.offset;

            if(offset > 0) {
                offset = limit+100;
                this.box.css("transform", "translateX(" + offset + "%)")
            } else {
                this.box.css("transform", "translateX(" + offset + "%)")
            }
        }.bind(this));
    }

    PanelControl.prototype.productsFilter = function() {
        this.navElems.on("click", function(e) {
            this.navElems.siblings().removeClass("active");
            $(e.target).addClass("active");

            $(this.products).css("display", "block");
            var category = $(e.target).text().toLowerCase();

            function filter(category) {
                var category = category;
                if(category != "all") {
                    this.products.each(function(i, elem) {
                        if(elem.dataset.category != category) {
                            $(elem).css("display", "none");
                        }
                    });
                }
            }

            switch(category) {
                case "all":
                    filter.call(this, "all");
                    break;
                case "clothing":
                    filter.call(this, "clothing");
                    break;
                case "electronics":
                    filter.call(this, "electronics");
                    break;
                case "shoes":
                    filter.call(this, "shoes");
                    break;
            }

            this.slideProduct();
        }.bind(this));
    }

    var newProducts = new PanelControl("#newProducts", true);
    var hotDeals = new PanelControl("#hotDeals");
    var latestProducts = new PanelControl("#latestProducts", true);
    var specialDeal = new PanelControl("#specialDeal");
    var featuredProducts = new PanelControl("#featuredProducts", true);

  })
})(jQuery);
