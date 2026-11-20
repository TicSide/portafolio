/**
 * Fragmentos de código reales, copiados de los repositorios públicos.
 * Las líneas omitidas se marcan con un comentario "…".
 */

const dyOrg = 'https://github.com/1ASI0729-7401-2520-Prodevs-DenunciaYa';

/** DenunciaYa-Backend · ComplaintResourceController.java (líneas 91-106, autor: TicSide). */
export const createComplaint = {
  file: 'ComplaintResourceController.java',
  lang: 'java' as const,
  href: `${dyOrg}/DenunciaYa-Backend/blob/develop/src/main/java/com/denunciayabackend/complaintCreation/interfaces/ComplaintResourceController.java`,
  code: `@Operation(summary = "Create new complaint",
           description = "Creates a new complaint in the system")
@ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Complaint created successfully"),
    @ApiResponse(responseCode = "400", description = "Invalid input data"),
    @ApiResponse(responseCode = "500", description = "Internal server error")
})
@PostMapping
public ResponseEntity<ComplaintResource> createComplaint(
        @Parameter(description = "Complaint data to create", required = true)
        @RequestBody CreateComplaintResource resource) {

    var command = createCommandAssembler.toCommandFromResource(resource);
    var complaint = complaintCommandService.handle(command);
    var complaintResource = complaintResourceAssembler.toResourceFromEntity(complaint);
    return ResponseEntity.ok(complaintResource);
}`,
};

/** PeruJam2025Cultura · TriggerCinematic.cs (líneas 34-46 y 70-77, autor: TicSide). */
export const triggerCinematic = {
  file: 'TriggerCinematic.cs',
  lang: 'csharp' as const,
  href: 'https://github.com/ElJulioGG/PeruJam2025Cultura/blob/main/CulturaPeu2025/Assets/Script/UI/TriggerCinematic.cs',
  code: `private void OnTriggerEnter2D(Collider2D other)
{
    if (!hasPlayed && other.CompareTag("Player"))
    {
        hasPlayed = true;
        GameManager.instance.playerCanMove = false;
        director.Play();
        director.stopped += OnTimelineFinished;
        gameObject.SetActive(false);
    }
}

private void OnTimelineFinished(PlayableDirector obj)
{
    // … reactiva jugador, cámara, mascota e interfaz
    director.stopped -= OnTimelineFinished;
    GameManager.instance.playerCanMove = true;
    SwitchToNewTarget();
    canvasUI.SetActive(true);
}`,
};

/** PatternsDesign · Strategy/Ex-3 (StripeAdapter.cs y PaymentSystem.cs). */
export const strategyAdapter = {
  file: 'PaymentSystem.cs · StripeAdapter.cs',
  lang: 'csharp' as const,
  href: 'https://github.com/TicSide/PatternsDesign',
  code: `class PaymentSystem
{
    private IPaymentStrategy paymentStrategy;

    public PaymentSystem(IPaymentStrategy paymentStrategy)
    {
        this.paymentStrategy = paymentStrategy;
    }

    public void ProcessPayment(decimal amount) => paymentStrategy.Pay(amount);
}

class StripeAdapter : IPaymentStrategy
{
    private readonly Stripe stripe;
    public StripeAdapter(Stripe stripe) => this.stripe = stripe;
    public void Pay(decimal amount) => stripe.Charge(amount);
}`,
};

/** Endpoints reales de /api/v1/complaints (ComplaintResourceController.java). */
export const complaintEndpoints = [
  { method: 'GET', path: '/api/v1/complaints' },
  { method: 'POST', path: '/api/v1/complaints' },
  { method: 'GET', path: '/api/v1/complaints/{complaintId}' },
  { method: 'PUT', path: '/api/v1/complaints/{complaintId}' },
  { method: 'DELETE', path: '/api/v1/complaints/{complaintId}' },
  { method: 'GET', path: '/api/v1/complaints/status/{status}' },
  { method: 'GET', path: '/api/v1/complaints/department/{department}/city/{city}' },
  { method: 'PATCH', path: '/api/v1/complaints/{complaintId}/status' },
  { method: 'PATCH', path: '/api/v1/complaints/{complaintId}/timeline/advance' },
  { method: 'PATCH', path: '/api/v1/complaints/{complaintId}/timeline/accept' },
  { method: 'PATCH', path: '/api/v1/complaints/{complaintId}/timeline/reject' },
  { method: 'PATCH', path: '/api/v1/complaints/{complaintId}/timeline/item' },
  { method: 'PUT', path: '/api/v1/complaints/{complaintId}/timeline/{timelineItemId}' },
  { method: 'PUT', path: '/api/v1/complaints/{complaintId}/timeline/{timelineItemId}/accept' },
  { method: 'PUT', path: '/api/v1/complaints/{complaintId}/timeline/{timelineItemId}/reject' },
  { method: 'PUT', path: '/api/v1/complaints/{complaintId}/timeline/{timelineItemId}/status' },
  { method: 'POST', path: '/api/v1/complaints/{complaintId}/timeline/sync' },
] as const;
