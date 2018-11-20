export * from "./nativescript-fresco-common";
import * as commonModule from "./nativescript-fresco-common";
export declare function initialize(config?: commonModule.ImagePipelineConfigSetting): void;
export declare class ImagePipeline {
    private _ios;
    constructor();
    isInDiskCacheSync(uri: string): boolean;
    isInBitmapMemoryCache(uri: string): boolean;
    evictFromMemoryCache(uri: string): void;
    evictFromDiskCache(uri: string): void;
    evictFromCache(uri: string): void;
    clearCaches(): void;
    clearMemoryCaches(): void;
    clearDiskCaches(): void;
    readonly ios: SDImageCache;
}
export declare function getImagePipeline(): ImagePipeline;
export declare class FrescoDrawee extends commonModule.FrescoDrawee {
    nativeViewProtected: FLAnimatedImageView;
    isLoading: boolean;
    private _imageSourceAffectsLayout;
    createNativeView(): FLAnimatedImageView;
    initNativeView(): void;
    onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    private static computeScaleFactor(measureWidth, measureHeight, widthIsFinite, heightIsFinite, nativeWidth, nativeHeight, imageStretch);
    updateImageUri(): void;
    protected onImageUriChanged(oldValue: string, newValue: string): void;
    protected onPlaceholderImageUriChanged(oldValue: string, newValue: string): void;
    protected onFailureImageUriChanged(oldValue: string, newValue: string): void;
    protected onActualImageScaleTypeChanged(oldValue: string, newValue: string): void;
    protected onAspectRatioChanged(oldValue: number, newValue: number): void;
    private initDrawee();
    private handleImageLoaded;
    private onLoadProgress;
    private getUIImage(path);
    private initImage();
}
