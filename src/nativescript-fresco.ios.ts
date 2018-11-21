export * from "./nativescript-fresco-common";
import * as commonModule from "./nativescript-fresco-common";
import * as utils from "tns-core-modules/utils/utils";
import * as types from "tns-core-modules/utils/types";
import * as application from "tns-core-modules/application";
import * as imageSource from "tns-core-modules/image-source";
import * as fs from "tns-core-modules/file-system";
import { Color } from "tns-core-modules/color/color";

import { layout } from "tns-core-modules/ui/core/view";

const enum SDImageCacheType {
  SDImageCacheTypeNone,
  SDImageCacheTypeDisk,
  SDImageCacheTypeMemory
}

function getScaleType(scaleType: string) {
  if (types.isString(scaleType)) {
    switch (scaleType) {
      case commonModule.ScaleType.Center:
      case commonModule.ScaleType.CenterCrop:
        return SDImageScaleMode.AspectFill;
      case commonModule.ScaleType.CenterInside:
      case commonModule.ScaleType.FitCenter:
      case commonModule.ScaleType.FitEnd:
      case commonModule.ScaleType.FitStart:
        return SDImageScaleMode.AspectFit;
      case commonModule.ScaleType.FitXY:
      case commonModule.ScaleType.FocusCrop:
        return SDImageScaleMode.Fill;
      default:
        break;
    }
  }

  return null;
}

export function initialize(
  config?: commonModule.ImagePipelineConfigSetting
): void {}

export class ImagePipeline {
  private _ios: SDImageCache;
  constructor() {
    this._ios = SDImageCache.sharedImageCache;
  }

  // Currently not available in 0.9.0+
  isInDiskCacheSync(uri: string) {
    return this._ios.diskImageDataExistsWithKey(uri);
  }

  isInBitmapMemoryCache(uri: string): boolean {
    return this._ios.imageFromMemoryCacheForKey(uri) !== null;
  }

  evictFromMemoryCache(uri: string): void {
    this._ios.removeImageFromMemoryForKey(uri);
  }

  evictFromDiskCache(uri: string): void {
    this._ios.removeImageFromDiskForKey(uri);
  }

  evictFromCache(uri: string): void {
    this._ios.removeImageForKeyWithCompletion(uri, null);
  }

  clearCaches() {
    this._ios.clearMemory();
    this._ios.clearDiskOnCompletion(null);
  }

  clearMemoryCaches() {
    this._ios.clearMemory();
  }

  clearDiskCaches() {
    this._ios.clearDiskOnCompletion(null);
  }
  get ios() {
    return this._ios;
  }
}

export function getImagePipeline(): ImagePipeline {
  let imagePineLine = new ImagePipeline();
  return imagePineLine;
}

export class FrescoDrawee extends commonModule.FrescoDrawee {
  nativeViewProtected: SDAnimatedImageView;
  isLoading = false;
  private _imageSourceAffectsLayout: boolean = true;
  public createNativeView() {
    const result = SDAnimatedImageView.new();
    result.tintColor = null;
    return result;
  }

  public initNativeView(): void {
    this.initDrawee();
    // this.updateHierarchy();
  }

  public onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void {
    // We don't call super because we measure native view with specific size.
    const width = layout.getMeasureSpecSize(widthMeasureSpec);
    const widthMode = layout.getMeasureSpecMode(widthMeasureSpec);

    const height = layout.getMeasureSpecSize(heightMeasureSpec);
    const heightMode = layout.getMeasureSpecMode(heightMeasureSpec);
    const image = this.nativeViewProtected.image;
    const nativeWidth = image ? layout.toDevicePixels(image.size.width) : 0;
    const nativeHeight = image ? layout.toDevicePixels(image.size.height) : 0;

    let measureWidth = Math.max(nativeWidth, this.effectiveMinWidth);
    let measureHeight = Math.max(nativeHeight, this.effectiveMinHeight);

    const finiteWidth: boolean = widthMode !== layout.UNSPECIFIED;
    const finiteHeight: boolean = heightMode !== layout.UNSPECIFIED;

    this._imageSourceAffectsLayout =
      widthMode !== layout.EXACTLY || heightMode !== layout.EXACTLY;

    if (
      nativeWidth !== 0 &&
      nativeHeight !== 0 &&
      (finiteWidth || finiteHeight)
    ) {
      //   console.log(
      //     "onMeasure",
      //     !!image,
      //     width,
      //     height,
      //     finiteWidth,
      //     finiteHeight,
      //     nativeWidth,
      //     nativeHeight,
      //     this.stretch
      //   );
      const scale = FrescoDrawee.computeScaleFactor(
        width,
        height,
        finiteWidth,
        finiteHeight,
        nativeWidth,
        nativeHeight,
        this.stretch
      );
      const resultW = Math.round(nativeWidth * scale.width);
      const resultH = Math.round(nativeHeight * scale.height);

      measureWidth = finiteWidth ? Math.min(resultW, width) : resultW;
      measureHeight = finiteHeight ? Math.min(resultH, height) : resultH;

      //   if (traceEnabled()) {
      //     traceWrite(
      //       "Image stretch: " +
      //         this.stretch +
      //         ", nativeWidth: " +
      //         nativeWidth +
      //         ", nativeHeight: " +
      //         nativeHeight,
      //       traceCategories.Layout
      //     );
      //   }
    }

    const widthAndState = FrescoDrawee.resolveSizeAndState(
      measureWidth,
      width,
      widthMode,
      0
    );
    const heightAndState = FrescoDrawee.resolveSizeAndState(
      measureHeight,
      height,
      heightMode,
      0
    );

    this.setMeasuredDimension(widthAndState, heightAndState);
  }

  private static computeScaleFactor(
    measureWidth: number,
    measureHeight: number,
    widthIsFinite: boolean,
    heightIsFinite: boolean,
    nativeWidth: number,
    nativeHeight: number,
    imageStretch: string
  ): { width: number; height: number } {
    let scaleW = 1;
    let scaleH = 1;

    if (
      (imageStretch === "aspectFill" ||
        imageStretch === "aspectFit" ||
        imageStretch === "fill") &&
      (widthIsFinite || heightIsFinite)
    ) {
      scaleW = nativeWidth > 0 ? measureWidth / nativeWidth : 0;
      scaleH = nativeHeight > 0 ? measureHeight / nativeHeight : 0;

      if (!widthIsFinite) {
        scaleW = scaleH;
      } else if (!heightIsFinite) {
        scaleH = scaleW;
      } else {
        // No infinite dimensions.
        switch (imageStretch) {
          case "aspectFit":
            scaleH = scaleW < scaleH ? scaleW : scaleH;
            scaleW = scaleH;
            break;
          case "aspectFill":
            scaleH = scaleW > scaleH ? scaleW : scaleH;
            scaleW = scaleH;
            break;
        }
      }
    }
    return { width: scaleW, height: scaleH };
  }

  // public disposeNativeView() {
  //     this._android.setImageURI(null, null);
  //     this._android = undefined;
  // }

  public updateImageUri() {
    let imagePipeLine = getImagePipeline();
    let isInCache = imagePipeLine.isInBitmapMemoryCache(this.imageUri);
    if (isInCache) {
      imagePipeLine.evictFromCache(this.imageUri);
      let imageUri = this.imageUri;
      this.imageUri = null;
      this.imageUri = imageUri;
    }
  }

  protected onImageUriChanged(oldValue: string, newValue: string) {
    this.initImage();
  }

  protected onPlaceholderImageUriChanged(oldValue: string, newValue: string) {
    // this.updateHierarchy();
  }

  protected onFailureImageUriChanged(oldValue: string, newValue: string) {
    // this.updateHierarchy();
  }

  protected onActualImageScaleTypeChanged(oldValue: string, newValue: string) {
    if (!this.nativeView) {
      return;
    }
    switch (newValue) {
      case "aspectFit":
        this.nativeView.contentMode = UIViewContentMode.ScaleAspectFit;
        break;
      case "aspectFill":
        this.nativeView.contentMode = UIViewContentMode.ScaleAspectFill;
        break;
      case "fill":
        this.nativeView.contentMode = UIViewContentMode.ScaleToFill;
        break;
      case "none":
      default:
        this.nativeView.contentMode = UIViewContentMode.TopLeft;
        break;
    }
  }

  protected onAspectRatioChanged(oldValue: number, newValue: number) {
    this.initImage();
  }

  private initDrawee() {
    this.initImage();
  }

  private handleImageLoaded = (
    image: UIImage,
    error: NSError,
    cacheType: number
  ) => {
    console.log(
      "handleImageLoaded",
      this.imageUri,
      !!error,
      !!image,
      error ? error.localizedDescription : null
    );
    if (error) {
      let args = {
        eventName: commonModule.FrescoDrawee.failureEvent,
        object: this,
        error: error
      };

      this.notify(args);
      if (this.failureImageUri) {
        this.nativeView.image = this.getUIImage(this.failureImageUri);
      } else {
        this.nativeView.image = null;
      }
    }

    // if (this.tintColor) {
    //   image = image.imageWithRenderingMode(UIImageRenderingMode.AlwaysTemplate);
    // }

    if (this._imageSourceAffectsLayout) {
      this.requestLayout();
    }
    this.isLoading = false;
    if (
      !(
        this.onlyTransitionIfRemote &&
        cacheType !== SDImageCacheType.SDImageCacheTypeMemory
      ) &&
      this.transition
    ) {
      switch (this.transition) {
        case "fade":
          this.nativeView.alpha = 0.0;
          this.nativeView.image = image;
          UIView.animateWithDurationAnimations(0.2, () => {
            this.nativeView.alpha = this.opacity;
          });
          break;
        case "curlUp":
          UIView.transitionWithViewDurationOptionsAnimationsCompletion(
            this.nativeView,
            0.3,
            UIViewAnimationOptions.TransitionCrossDissolve,
            () => {
              this.nativeView.image = image;
            },
            null
          );
          break;
        default:
          this.nativeView.image = image;
      }
    } else {
      this.nativeView.image = image;
    }
    // if (image && cacheType !== SDImageCacheType.SDImageCacheTypeMemory)
    // {
    //     this.nativeView.alpha = 0.0;
    //     UIView.animateWithDurationAnimations(0.2, ()=>{
    //         this.nativeView.alpha = this.opacity;
    //     });
    // }
  }
  private onLoadProgress = (p1: number, p2: number) => {
    // console.log("onLoadProgresss ", p1, p2);
  }

  private getUIImage(path: string) {
    let image;
    if (utils.isFileOrResourcePath(path)) {
      if (path.indexOf(utils.RESOURCE_PREFIX) === 0) {
        image = imageSource.fromFileOrResource(path);
      } else {
        image = imageSource.fromFileOrResource(path);
      }
    }
    // console.log("getUIImage", path, !!image, !!image && !!image.ios);
    if (image) {
      image = image.ios;
    }

    return image;
  }

  private initImage() {
    if (this.nativeViewProtected) {
      if (this.imageUri) {
        this.isLoading = true;
        let options =
          SDWebImageOptions.ScaleDownLargeImages |
          SDWebImageOptions.AvoidAutoSetImage;
        // if (this.onlyTransitionIfRemote) {
        //     options |= SDWebImageOptions.ForceTransition;
        // }
        let context: NSDictionary<
          string,
          any
        > = NSMutableDictionary.dictionary();
        let transformers = [];
        if (!!this.progressiveRenderingEnabled) {
          options = options | SDWebImageOptions.ProgressiveLoad;
        }
        // if (this.actualImageScaleType) {
        //   transformers.push(
        //     SDImageResizingTransformer.transformerWithSizeScaleMode()
        //   );
        //   // requestBuilder.setResizeOptions(
        //   //   new com.facebook.imagepipeline.common.ResizeOptions(
        //   //     this.decodeWidth,
        //   //     this.decodeHeight
        //   //   )
        //   // );
        // }
        if (this.decodeWidth && this.decodeHeight) {
          console.log("crop ", this.decodeWidth, this.decodeHeight / 2);
          transformers.push(
            SDImageCroppingTransformer.transformerWithRect(
              CGRectMake(0, 0, this.decodeWidth, this.decodeHeight / 2)
            )
            // SDImageResizingTransformer.transformerWithSizeScaleMode(
            //   CGSizeMake(this.decodeWidth, this.decodeHeight),
            //   getScaleType(this.actualImageScaleType)
            // )
          );
          // requestBuilder.setResizeOptions(
          //   new com.facebook.imagepipeline.common.ResizeOptions(
          //     this.decodeWidth,
          //     this.decodeHeight
          //   )
          // );
        }
        if (this.tintColor) {
          transformers.push(
            SDImageTintTransformer.transformerWithColor(this.tintColor.ios)
          );
        }
        if (this.blurRadius) {
          transformers.push(
            SDImageBlurTransformer.transformerWithRadius(this.blurRadius)
          );
          // const postProcessor: any = new jp.wasabeef.fresco.processors.BlurPostprocessor(
          //   this._context,
          //   this.blurRadius,
          //   this.blurDownSampling || 1
          // );
          // requestBuilder.setPostprocessor(postProcessor);
        }
        // console.log("loading image", this.imageUri);

        if (transformers.length > 0) {
        //   console.log("adding context transformers ", transformers.length);
          context.setValueForKey(
            SDImagePipelineTransformer.transformerWithTransformers(
              transformers
            ),
            SDWebImageContextImageTransformer
          );
        }
        let uri: any = this.imageUri;

        if (this.imageUri.indexOf(utils.RESOURCE_PREFIX) === 0) {
            let resName = this.imageUri.substr(utils.RESOURCE_PREFIX.length);
            uri = NSBundle.mainBundle.URLForResourceWithExtension(resName, 'png')
            || NSBundle.mainBundle.URLForResourceWithExtension(resName, 'jpg')
            || NSBundle.mainBundle.URLForResourceWithExtension(resName, 'gif');
          }
        if (this.imageUri.indexOf("~/") === 0) {
          uri = NSURL.alloc().initFileURLWithPath(`${fs.path.join(
            fs.knownFolders.currentApp().path,
            this.imageUri.replace("~/", "")
          )}`);
        }
        // console.log("about to load", this.imageUri, uri);
        this.nativeViewProtected.sd_setImageWithURLPlaceholderImageOptionsContextProgressCompleted(
            uri as any,
          this.placeholderImageUri
            ? this.getUIImage(this.placeholderImageUri)
            : null,
          options,
          context,
          this.onLoadProgress,
          this.handleImageLoaded
        );
      }
    }
  }
  [commonModule.FrescoDrawee.stretchProperty.setNative](
    value: commonModule.Stretch
  ) {
    switch (value) {
      case "aspectFit":
        this.nativeView.contentMode = UIViewContentMode.ScaleAspectFit;
        break;
      case "aspectFill":
        this.nativeView.contentMode = UIViewContentMode.ScaleAspectFill;
        break;
      case "fill":
        this.nativeView.contentMode = UIViewContentMode.ScaleToFill;
        break;
      case "none":
      default:
        this.nativeView.contentMode = UIViewContentMode.TopLeft;
        break;
    }
  }
}
